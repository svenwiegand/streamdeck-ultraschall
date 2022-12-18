import * as assert from "assert"
import {Plugin} from "../streamdeck/plugin/Plugin"
import {TransportAction} from "./actions/TransportAction"
import {Osc} from "./osc/Osc"
import {initLogging} from "../common/logging"

initLogging()
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

const plugin = new Plugin(registration.port, registration.event, registration.uuid)
const osc = new Osc()
plugin.on("applicationDidLaunch", () => {
    osc.connect("127.0.0.1", 8000, "0.0.0.0", 9050)
})
plugin.on("applicationDidTerminate", () => {
    osc.close()
})

plugin.registerAction(new TransportAction(osc))