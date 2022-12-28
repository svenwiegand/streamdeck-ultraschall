import {Osc} from "../osc/Osc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {actionId, Settings} from "common/actions/mute"
import {AppearanceEvent, KeyEvent} from "streamdeck/plugin/events"
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

    protected onWillAppear(instance: Instance, payload: AppearanceEvent<Settings>["payload"]) {
        super.onWillAppear(instance, payload)
        if (!("track" in payload.settings)) {
            const usedTracks = this.mapInstances(i => i.settings.track).filter(track => !!track)
            const maxTrack = usedTracks.length > 0 ? Math.max(...usedTracks) : 0
            const nextTrack = maxTrack < 10 ? maxTrack + 1 : 1
            const settings = {track: nextTrack}
            const prevSettings = instance.settings
            instance.setSettings(settings)
            this.onDidReceiveSettings(instance, settings, prevSettings)
        }
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
            const track = payload.settings.track
            const formattedTrack = track >= 10 ? `0${track}` : `00${track}`
            this.osc.send(`/action/_Ultraschall_${mute ? "Mute" : "UnMute"}_Track${formattedTrack}`)
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