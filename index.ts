import { writeFileSync } from "node:fs"
import { createSumType } from "./java-sumtype-generator.ts"

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
    imports: "all",
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
