import { readFileSync, writeFileSync } from "node:fs"
import { createSumType } from "./java-sumtype-generator.js"

const config = JSON.parse(readFileSync("java-sumtypes.json", "utf8"))

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