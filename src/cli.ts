import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { createSumType } from "./java-sumtype-generator.js"
import { z } from "zod"
import path from "node:path"

/*
{
  "java-sumtypes": [
    {
      "name": "Tree",
      "packageName": "se.vandmo.javasumtypes",
      "types": {
        "Empty": {},
        "Leaf": { "value": "int" },
        "Node": { "left": "Tree", "right": "Tree", "value": "int" }
      },
      "imports": "all"
    },
*/

const ConfigSchema = z.object({
  "java-sumtypes": z.array(
    z.object({
      name: z.string(),
      "package-name": z.optional(z.string()),
      types: z.record(z.string(), z.record(z.string(), z.string())),
      imports: z.enum(["all", "none"]).default("none"),
    }),
  ),
})
const config = ConfigSchema.parse(JSON.parse(readFileSync("java-sumtypes.json", "utf8")))
if ("java-sumtypes" in config) {
  for (const sumType of config["java-sumtypes"]) {
    const packageName = sumType["package-name"]
    const javaPath = path.join("src", "main", "java")
    const packagePath = packageName ? path.join(javaPath, path.join(...packageName.split("."))) : javaPath
    mkdirSync(packagePath, { recursive: true })
    const filename = path.join(packagePath, `${sumType.name}.java`)
    writeFileSync(
      filename,
      createSumType({
        packageName,
        name: sumType.name,
        types: sumType.types,
        imports: sumType.imports,
      }),
    )
  }
}
