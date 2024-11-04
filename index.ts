import { writeFileSync } from "node:fs"
import { type } from "node:os"

type Schema = {
  packageName?: string
  name: string
  types: Record<string, Record<string, string>>
}

const PRIMITIVE_TYPES = new Set(["boolean", "byte", "char", "short", "int", "long", "float", "double"])
const JAVA_MAX_INT = 2147483647

const hash = (s: string) => {
  let hash = 0
  for (const c of s) {
    hash = (hash << 5) - hash + c.charCodeAt(0)
    hash = hash & hash
  }
  return Math.abs(hash) % (JAVA_MAX_INT + 1)
}

const createSumType = (schema: Schema) => {
  let result = ""
  const emit = (s: string) => {
    result += `${s}\n`
  }
  const { packageName, name, types } = schema
  const typeNames: string[] = Object.keys(types)

  if (packageName !== undefined) {
    emit(`package ${packageName};`)
    emit("")
  }

  emit(`public abstract class ${name} {`)
  emit("")

  for (const [type, fields] of Object.entries(types)) {
    if (Object.keys(fields).length === 0) {
      emit(`  private static final ${name}.${type} ${type} = new ${type}();`)
    }
  }
  emit("")

  emit(`  private ${name}() {}`)
  emit("")

  for (const [type, fields] of Object.entries(types)) {
    const params = Object.entries(fields)
      .map(([fieldName, fieldType]) => `${fieldType} ${fieldName}`)
      .join(", ")
    emit(`  public static ${name}.${type} ${type}(${params}) {`)
    if (Object.keys(fields).length === 0) {
      emit(`    return ${type};`)
    } else {
      const args = Object.keys(fields).join(", ")
      emit(`    return new ${type}(${args});`)
    }
    emit("  }")
    emit("")
  }

  for (const [type, fields] of Object.entries(types)) {
    emit(`  public final static class ${type} extends ${name} {`)
    for (const [fieldName, fieldType] of Object.entries(fields)) {
      emit(`    public final ${fieldType} ${fieldName};`)
    }
    const params = Object.entries(fields)
      .map(([fieldName, fieldType]) => `${fieldType} ${fieldName}`)
      .join(", ")

    // constructor(...)
    emit(`    private ${type}(${params}) {`)
    for (const [fieldName, fieldType] of Object.entries(fields)) {
      if (PRIMITIVE_TYPES.has(fieldType)) {
        emit(`      this.${fieldName} = ${fieldName};`)
      } else {
        emit(`      this.${fieldName} = java.util.Objects.requireNonNull(${fieldName});`)
      }
    }
    emit("    }")

    // toString()
    emit("    @Override")
    emit("    public String toString() {")
    emit(`      return "${type}{"`)
    for (const fieldName of Object.keys(fields)) {
      emit(`        + "${fieldName}=" + ${fieldName}`)
    }
    emit('        + "}";')
    emit("    }")

    // equals(...)
    emit("    @Override")
    emit("    public boolean equals(Object o) {")
    emit("      if (o == this) {")
    emit("        return true;")
    emit("      }")
    emit(`      if (o instanceof ${name}.${type}) {`)
    emit(`        ${name}.${type} that = (${name}.${type}) o;`)
    emit("        return true")
    for (const [fieldName, fieldType] of Object.entries(fields)) {
      if (PRIMITIVE_TYPES.has(fieldType)) {
        emit(`          && this.${fieldName} == that.${fieldName}`)
      } else {
        emit(`          && this.${fieldName}.equals(that.${fieldName})`)
      }
    }
    emit("          ;")
    emit("      }")
    emit("      return false;")
    emit("    }")

    // hashCode()
    emit("    @Override")
    emit("    public int hashCode() {")
    emit(`      return java.util.Objects.hash(${hash(type)}`)
    for (const fieldName of Object.keys(fields)) {
      emit(`          , this.${fieldName}`)
    }
    emit("      );")
    emit("    }")

    emit("  }")
    emit("")
  }

  // matching()
  if (typeNames.length > 0) {
    emit(`  public final <T> Matching_${typeNames[0]}<T> matching() {`)
    emit(`    return new Matching_${typeNames[0]}<T>();`)
    emit("  }")
    for (let i = 0; i < typeNames.length; ++i) {
      const typeName = typeNames[i]
      const nextMatching = i === typeNames.length - 1 ? "FinalMatching" : `Matching_${typeNames[i + 1]}`
      const previousTypeNames = typeNames.slice(0, i)
      const params = previousTypeNames
        .map((typeName) => `java.util.function.Function<${typeName}, T> ${typeName}_matcher`)
        .join(", ")
      const args = previousTypeNames
        .slice(0, i)
        .map((typeName) => `${typeName}_matcher`)
        .concat(["java.util.Objects.requireNonNull(matcher)"])
        .join(", ")
      emit(`  public final class Matching_${typeName}<T> {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`    private final java.util.function.Function<${previousTypeName}, T> ${previousTypeName}_matcher;`)
      }
      emit(`    private Matching_${typeName}(${params}) {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`      this.${previousTypeName}_matcher = ${previousTypeName}_matcher;`)
      }
      emit("    }")
      emit(`    public ${nextMatching}<T> ${typeName}(java.util.function.Function<${typeName}, T> matcher) {`)
      emit(`      return new ${nextMatching}<T>(${args});`)
      emit("    }")
      emit("  }")
    }
    const params = typeNames
      .map((typeName) => `java.util.function.Function<${typeName}, T> ${typeName}_matcher`)
      .join(", ")
    emit("  public final class FinalMatching<T> {")
    for (const typeName of typeNames) {
      emit(`    private final java.util.function.Function<${typeName}, T> ${typeName}_matcher;`)
    }
    emit(`    private FinalMatching(${params}) {`)
    for (const typeName of typeNames) {
      emit(`      this.${typeName}_matcher = ${typeName}_matcher;`)
    }
    emit("    }")
    emit("    public T get() {")
    for (const typeName of typeNames) {
      emit(`      if (${name}.this instanceof ${name}.${typeName}) {`)
      emit(`        return ${typeName}_matcher.apply((${name}.${typeName})${name}.this);`)
      emit("      }")
    }
    emit(`      throw new IllegalStateException("Encountered illegal ${name} subclass");`)
    emit("    }")
    emit("  }")
  }

  // visiting()
  if (typeNames.length > 0) {
    emit(`  public final Visiting_${typeNames[0]} visiting() {`)
    emit(`    return new Visiting_${typeNames[0]}();`)
    emit("  }")
    for (let i = 0; i < typeNames.length; ++i) {
      const typeName = typeNames[i]
      const nextVisiting = i === typeNames.length - 1 ? "FinalVisiting" : `Visiting_${typeNames[i + 1]}`
      const previousTypeNames = typeNames.slice(0, i)
      const params = previousTypeNames
        .map((typeName) => `java.util.function.Consumer<${typeName}> ${typeName}_visitor`)
        .join(", ")
      const args = previousTypeNames
        .slice(0, i)
        .map((typeName) => `${typeName}_visitor`)
        .concat(["java.util.Objects.requireNonNull(visitor)"])
        .join(", ")
      emit(`  public final class Visiting_${typeName} {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`    private final java.util.function.Consumer<${previousTypeName}> ${previousTypeName}_visitor;`)
      }
      emit(`    private Visiting_${typeName}(${params}) {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`      this.${previousTypeName}_visitor = ${previousTypeName}_visitor;`)
      }
      emit("    }")
      emit(`    public ${nextVisiting} ${typeName}(java.util.function.Consumer<${typeName}> visitor) {`)
      emit(`      return new ${nextVisiting}(${args});`)
      emit("    }")
      emit("  }")
    }
    const params = typeNames
      .map((typeName) => `java.util.function.Consumer<${typeName}> ${typeName}_visitor`)
      .join(", ")
    emit("  public final class FinalVisiting {")
    for (const typeName of typeNames) {
      emit(`    private final java.util.function.Consumer<${typeName}> ${typeName}_visitor;`)
    }
    emit(`    private FinalVisiting(${params}) {`)
    for (const typeName of typeNames) {
      emit(`      this.${typeName}_visitor = ${typeName}_visitor;`)
    }
    emit("    }")
    emit("    public void visit() {")
    for (const typeName of typeNames) {
      emit(`      if (${name}.this instanceof ${name}.${typeName}) {`)
      emit(`        ${typeName}_visitor.accept((${name}.${typeName})${name}.this);`)
      emit("        return;")
      emit("      }")
    }
    emit(`      throw new IllegalStateException("Encountered illegal ${name} subclass");`)
    emit("    }")
    emit("  }")
  }

  emit("")
  emit(`}`)
  return result
}

writeFileSync(
  "Integrity.java",
  createSumType({
    name: "Integrity",
    types: {
      Calculated: { checksum: "String" },
      CalculatedX: { checksum: "String", flurp: "int" },
      Folder: {},
      Polder: {},
    },
  }),
)

writeFileSync(
  "WithPackage.java",
  createSumType({
    packageName: "se.vandmo.javasumtypes",
    name: "WithPackage",
    types: {
      Folder: {},
    },
  }),
)

writeFileSync(
  "NoTypes.java",
  createSumType({
    name: "NoTypes",
    types: {},
  }),
)
