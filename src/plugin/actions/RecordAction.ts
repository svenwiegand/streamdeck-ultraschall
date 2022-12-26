import {OscAction} from "./OscAction"
import {Osc} from "../osc/Osc"
import {actionId} from "common/actions/transport"
import {Message} from "../osc/typedOsc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {KeyEvent} from "streamdeck/plugin/events"

export class RecordAction extends OscAction {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected onKeyDown(instance: ActionInstance, payload: KeyEvent<object>["payload"]) {
        super.onKeyDown(instance, payload)
        this.osc.send("/play")
    }

    protected instanceOscSubscribeAddress(settings: object): string | undefined {
        return "/time/str"
    }

    onOscMessage(instance: ActionInstance, msg: Message) {
        super.onOscMessage(instance, msg)
        const timeCode = msg.args?.[0] as string
        this.forEachInstance(instance => {
            instance.setTitel(timeCode)
        })
    }
}