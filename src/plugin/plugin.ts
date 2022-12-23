import assert from "assert"
import {Plugin} from "streamdeck/plugin/Plugin"
import {Osc} from "./osc/Osc"
import {initLogging} from "common/logging"
import {transportAction} from "./actions/transport"
import {GlobalSettings, globalSettingsDefault} from "common/actions/global"
import {DidReceiveGlobalSettingsEvent} from "streamdeck/common/events"
import {MuteAction} from "./actions/mute"

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

const plugin = new Plugin<object, GlobalSettings>(registration.port, registration.event, registration.uuid)
const osc = new Osc()
plugin.on("didReceiveGlobalSettings", (event: DidReceiveGlobalSettingsEvent<GlobalSettings>) => {
    const settings = {...globalSettingsDefault, ...event.payload.settings}
    osc.connect(settings.hostIp, settings.sendPort, "0.0.0.0", settings.receivePort)
})
plugin.on("applicationDidLaunch", () => {
    plugin.sendEvent({event: "getGlobalSettings", context: plugin.uuid})
})
plugin.on("applicationDidTerminate", () => {
    osc.close()
})

plugin.registerAction(transportAction(osc))
plugin.registerAction(new MuteAction(osc))