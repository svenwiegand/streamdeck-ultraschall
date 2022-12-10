import {Client} from "node-osc"
import * as assert from "assert"
import {Plugin} from "../common/streamdeck/Plugin"
import {ActionKeyEvent} from "../common/streamdeck/events/receive"

console.log(new Date())
process.argv.forEach(arg => console.log(arg))

assert(process.argv[2] === "-port")
const registration = {
    port: parseInt(process.argv[3]),
    uuid: process.argv[5],
    event: process.argv[7],
    info: JSON.parse(process.argv[9])
}
console.debug(registration)

type Settings = { test: string }
const plugin = new Plugin<Settings>(registration.port, registration.event, registration.uuid)
const osc = new Client("127.0.0.1", 8000)
plugin.on("keyDown", () => {
    osc.send("t/play")
})