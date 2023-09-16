#!/usr/bin/env node

import {Command} from "commander"
import downloadFolder from "./main.js"

const program = new Command()

program
  .command("get <component>")
  .description("Download a component from ram-ui library")
  .action(async (component) => {
    try {
      await downloadFolder(component)
    } catch (err) {
      console.log(err)
    }
  })

program.parse(process.argv)
