import {Osc} from "../osc/Osc"
import {PluginAction} from "streamdeck/plugin/PluginAction"
import {actionId, Settings} from "common/actions/mute"
import {ReceiveEvent} from "streamdeck/plugin/events"
import iconMute from "assets/images/key-mute.svg"
import iconMuted from "assets/images/key-muted.svg"

export class MuteAction extends PluginAction<Settings> {
    protected readonly osc: Osc
    private muted = false

    constructor(osc: Osc) {
        super(actionId)
        this.osc = osc
    }

    protected onEvent(event: ReceiveEvent<Settings>) {
        switch (event.event) {
            case "didReceiveSettings": return this.onDidReceiveSettings(event.context, event.payload.settings)
            case "keyDown": return this.onKeyDown(event.context)
            default:
        }
    }

    private onDidReceiveSettings(context: string, settings: Settings) {
        this.sendEvent({
            event: "setTitle",
            context: context,
            payload: {
                title: settings.track.toString() ?? "",
            }
        })
    }

    private onKeyDown(context: string) {
        const icon = this.muted ? iconMuted : iconMute
        this.muted = !this.muted
        this.sendEvent({
            event: "setImage",
            context: context,
            payload: {
                image: icon,
            }
        })
    }
}