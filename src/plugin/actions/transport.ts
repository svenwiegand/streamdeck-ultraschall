import {Osc} from "../osc/Osc"
import {PluginAction, SimplePluginAction} from "../../streamdeck/plugin/PluginAction"
import {DidReceiveSettingsEvent} from "../../streamdeck/common/events"
import {actionId, Settings} from "../../common/actions/transport"

type Action = PluginAction<Settings>

function onDidReceiveSettings(event: DidReceiveSettingsEvent<Settings>, action: Action) {
    action.sendEvent({
        event: "setTitle",
        context: event.context,
        payload: {
            title: event.payload.settings.name ?? "",
            target: "both",
            state: 0,
        }
    })
}

function toggleRecord(osc: Osc) {
    osc.send("/play")
}

function onNewTimecode(timecode: string, action: Action) {
    action.sendEventToAllInstances({
        event: "setTitle",
        payload: {
            title: timecode,
            target: "both",
            state: 0,
        }
    })
}

export function transportAction(osc: Osc) {
    const action = new SimplePluginAction<Settings>(actionId, (event, action) => {
        switch (event.event) {
            case "didReceiveSettings": return onDidReceiveSettings(event, action)
            case "keyDown": return toggleRecord(osc)
            default:
        }
    })
    osc.onMessage("/time/str", msg => onNewTimecode(msg.args?.[0] as string, action))
    return action
}