import { Client } from "node-osc"
import * as fs from "fs"

console.log("Hello World!")
const args = process.argv.join("\n")
fs.writeFileSync("/Users/sven.wiegand/source/streamdeck/streamdeck-ultraschall/log.txt", args)

const osc = new Client("127.0.0.1", 8000)
osc.send("t/play", () => {
    osc.close()
})