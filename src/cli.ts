import { command, run, string, positional } from "cmd-ts"

const app = command({
  name: "java-sumtype-generator",
  args: {
    config: positional({ type: string, displayName: "configFile" }),
  },
  handler: ({ configFile }) => {
    console.log({ configFile })
  },
})

run(app, process.argv.slice(2))
