import {Osc} from "../osc/Osc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {actionId, Settings} from "common/actions/mute"
import {KeyEvent} from "streamdeck/plugin/events"
import {OscAction} from "./OscAction"
import iconMute from "assets/images/key-mute.svg"
import iconMuted from "assets/images/key-muted.svg"

interface State {
    muted: boolean
}

type Instance = ActionInstance<Settings, State>

export class MuteAction extends OscAction<Settings, State> {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected deriveState(settings: Settings, instance?: Instance): State | undefined {
        return {
            muted: false
        }
    }

    protected onKeyDown(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)
        if (instance.settings.track) {
            const mute = !instance.state?.muted
            this.osc.send(`/action/_Ultraschall_${mute ? "Mute" : "UnMute"}_Track00${payload.settings.track}`)
            this.forEachInstance(i => {
                if (i.settings.track === instance.settings.track) {
                    this.updateState(i, mute)
                }
            })
        }
    }

    protected instanceTitle(settings: Settings): string | undefined {
        return settings.track?.toString()
    }

    private updateState(instance: Instance, muted: boolean) {
        instance.state = { muted }
        instance.setImage(muted ? iconMuted : iconMute)
    }
}