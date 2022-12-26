import {Osc} from "../osc/Osc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {actionId, Settings} from "common/actions/mute"
import {KeyEvent} from "streamdeck/plugin/events"
import {OscAction} from "./OscAction"
import {Message} from "../osc/typedOsc"
import iconMute from "assets/images/key-mute.svg"
import iconMuted from "assets/images/key-muted.svg"

export class MuteAction extends OscAction<Settings> {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected onKeyDown(instance: ActionInstance<Settings>, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)
        // _Ultraschall_Toggle_Mute_Track001
        // _Ultraschall_Mute_Track001
        // _Ultraschall_UnMute_Track001
        // Tracks 001 - 010
        this.osc.send(`/action/_Ultraschall_Toggle_Mute_Track00${payload.settings.track}`)
    }

    protected instanceTitle(settings: Settings): string | undefined {
        return settings.track?.toString()
    }

    protected instanceOscSubscribeAddress(settings: Settings): string | undefined {
        return settings.track ? `/track/${settings.track}/mute` : undefined
    }

    onOscMessage(instance: ActionInstance<Settings>, msg: Message) {
        const muted = (msg.args?.[0] as number) > 0
        instance.setImage(muted ? iconMuted : iconMute)
    }
}