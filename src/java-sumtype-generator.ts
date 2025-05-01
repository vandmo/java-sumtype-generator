import { writeFileSync } from "node:fs"

export type Schema = {
  packageName?: string
  name: string
  types: Record<string, Record<string, string>>
  imports?: "all" | "none"
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

export const createSumType = (schema: Schema) => {
  let result = ""
  const emit = (s: string) => {
    result += `${s}\n`
  }
  const { packageName, name, types, imports } = schema
  const typeNames: string[] = Object.keys(types)

  const imported = new Set<string>()
  let Consumer: () => string
  let Function: () => string
  let Objects: () => string
  if (imports === undefined || imports === "none") {
    Consumer = () => "java.util.function.Consumer"
    Function = () => "java.util.function.Function"
    Objects = () => "java.util.Objects"
  } else if (imports === "all") {
    const makeImporter = (P: string, S: string) => {
      return () => {
        imported.add(`${P}.${S}`)
        return S
      }
    }
    Consumer = makeImporter("java.util.function", "Consumer")
    Function = makeImporter("java.util.function", "Function")
    Objects = makeImporter("java.util", "Objects")
  } else {
    throw new Error(`Unsupported imports value: '${imports}'`)
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
    const fieldNames = Object.keys(fields)
    const fieldEntries = Object.entries(fields)
    const params = fieldEntries.map(([fieldName, fieldType]) => `${fieldType} ${fieldName}`).join(", ")
    emit(`  public static ${name}.${type} ${type}(${params}) {`)
    if (fieldNames.length === 0) {
      emit(`    return ${type};`)
    } else {
      const args = fieldNames.join(", ")
      emit(`    return new ${type}(${args});`)
    }
    emit("  }")
    emit("")
  }

  for (const type of Object.keys(types)) {
    emit(`  public final boolean is_${type}() { return this instanceof ${name}.${type}; }`)
  }

  for (const [type, fields] of Object.entries(types)) {
    const fieldNames = Object.keys(fields)
    const fieldEntries = Object.entries(fields)
    emit(`  public final static class ${type} extends ${name} {`)
    for (const [fieldName, fieldType] of Object.entries(fields)) {
      emit(`    public final ${fieldType} ${fieldName};`)
    }
    const params = fieldEntries.map(([fieldName, fieldType]) => `${fieldType} ${fieldName}`).join(", ")

    // constructor(...)
    emit(`    private ${type}(${params}) {`)
    for (const [fieldName, fieldType] of fieldEntries) {
      if (PRIMITIVE_TYPES.has(fieldType)) {
        emit(`      this.${fieldName} = ${fieldName};`)
      } else {
        emit(`      this.${fieldName} = ${Objects()}.requireNonNull(${fieldName});`)
      }
    }
    emit("    }")

    // toString()
    emit("    @Override")
    emit("    public String toString() {")
    emit(`      return "${type}{"`)
    for (let i = 0; i < fieldNames.length; ++i) {
      const fieldName = fieldNames[i]
      const maybeComma = i === 0 ? "" : ","
      emit(`        + "${maybeComma}${fieldName}=" + ${fieldName}`)
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
    if (fieldEntries.length === 0) {
      emit("        return true;")
    } else {
      emit(`        ${name}.${type} that = (${name}.${type}) o;`)
      emit("        return")
      for (const [i, [fieldName, fieldType]] of fieldEntries.entries()) {
        const operator = i === 0 ? "" : "&& "
        if (PRIMITIVE_TYPES.has(fieldType)) {
          emit(`          ${operator}this.${fieldName} == that.${fieldName}`)
        } else {
          emit(`          ${operator}this.${fieldName}.equals(that.${fieldName})`)
        }
      }
      emit("          ;")
    }
    emit("      }")
    emit("      return false;")
    emit("    }")

    // hashCode()
    emit("    @Override")
    emit("    public int hashCode() {")
    const hashCodeArgs = [`${hash(type)}`].concat(fieldNames.map((fieldName) => `this.${fieldName}`)).join(", ")
    emit(`      return ${Objects()}.hash(${hashCodeArgs});`)
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
      const params = previousTypeNames.map((typeName) => `${Function()}<${typeName}, T> ${typeName}_matcher`).join(", ")
      const args = previousTypeNames
        .slice(0, i)
        .map((typeName) => `${typeName}_matcher`)
        .concat([`${Objects()}.requireNonNull(matcher)`])
        .join(", ")
      emit(`  public final class Matching_${typeName}<T> {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`    private final ${Function()}<${previousTypeName}, T> ${previousTypeName}_matcher;`)
      }
      emit(`    private Matching_${typeName}(${params}) {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`      this.${previousTypeName}_matcher = ${previousTypeName}_matcher;`)
      }
      emit("    }")
      emit(`    public ${nextMatching}<T> ${typeName}(${Function()}<${typeName}, T> matcher) {`)
      emit(`      return new ${nextMatching}<T>(${args});`)
      emit("    }")
      emit("  }")
    }
    const params = typeNames.map((typeName) => `${Function()}<${typeName}, T> ${typeName}_matcher`).join(", ")
    emit("  public final class FinalMatching<T> {")
    for (const typeName of typeNames) {
      emit(`    private final ${Function()}<${typeName}, T> ${typeName}_matcher;`)
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
      const params = previousTypeNames.map((typeName) => `${Consumer()}<${typeName}> ${typeName}_visitor`).join(", ")
      const args = previousTypeNames
        .slice(0, i)
        .map((typeName) => `${typeName}_visitor`)
        .concat([`${Objects()}.requireNonNull(visitor)`])
        .join(", ")
      emit(`  public final class Visiting_${typeName} {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`    private final ${Consumer()}<${previousTypeName}> ${previousTypeName}_visitor;`)
      }
      emit(`    private Visiting_${typeName}(${params}) {`)
      for (const previousTypeName of previousTypeNames) {
        emit(`      this.${previousTypeName}_visitor = ${previousTypeName}_visitor;`)
      }
      emit("    }")
      emit(`    public ${nextVisiting} ${typeName}(${Consumer()}<${typeName}> visitor) {`)
      emit(`      return new ${nextVisiting}(${args});`)
      emit("    }")
      emit("  }")
    }
    const params = typeNames.map((typeName) => `${Consumer()}<${typeName}> ${typeName}_visitor`).join(", ")
    emit("  public final class FinalVisiting {")
    for (const typeName of typeNames) {
      emit(`    private final ${Consumer()}<${typeName}> ${typeName}_visitor;`)
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

  let header = "// This file is automatically generated using https://github.com/vandmo/java-sumtype-generator\n"
  if (packageName !== undefined) {
    header += `package ${packageName};\n\n`
  }

  if (imported.size > 0) {
    for (const importedEntry of [...imported.values()].sort()) {
      header += `import ${importedEntry};\n`
    }
    header += "\n"
  }

  return header + result
}
