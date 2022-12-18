import {PluginAction} from "../../common/streamdeck/plugin/PluginAction"
import {ActionReceiveEvent} from "../../common/streamdeck/plugin/events"
import {Osc} from "../osc/Osc"
import {action} from "../../common/action"

interface Settings {
    name?: string
}

export class TransportAction extends PluginAction<Settings> {
    private osc: Osc

    constructor(osc: Osc) {
        super(action.transport)
        this.osc = osc
        // { address: '/time', args: [ 13.763957977294922 ] }
        // { address: '/time/str', args: [ '0:13.763' ] }
        osc.onMessage("/time/str", (msg) => {
            this.sendEventToAllInstances({
                event: "setTitle",
                context: "",
                payload: {
                    title: msg.args?.[0] as string,
                    target: "both",
                    state: 0,
                }
            })
        })
    }

    protected onEvent(event: ActionReceiveEvent<Settings>): void {
        switch (event.event) {
            case "didReceiveSettings":
                if (event.payload.settings.name) {
                    this.sendEvent({
                        event: "setTitle",
                        context: event.context,
                        payload: {
                            title: event.payload.settings.name,
                            target: "both",
                            state: 0,
                        }
                    })
                }
                break
            case "keyDown":
                this.osc.send("/play")
                break
            default:
        }
    }
}