import {Osc} from "../osc/Osc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {actionId, Settings} from "common/actions/mute"
import {AppearanceEvent, KeyEvent} from "streamdeck/plugin/events"
import {OscAction} from "./OscAction"
import iconMute from "assets/images/key-mute.svg"
import iconMuted from "assets/images/key-muted.svg"
import iconTalk from "assets/images/key-talk.svg"
import iconTalking from "assets/images/key-talking.svg"

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
            const settings: Settings = {track: nextTrack, mode: "toggle"}
            const prevSettings = instance.settings
            instance.setSettings(settings)
            this.onDidReceiveSettings(instance, settings, prevSettings)
        }
        this.mute(instance, payload.settings.mode === "pushToTalk")
    }

    protected onDidReceiveSettings(instance: ActionInstance<Settings, State, object, object>, settings: Settings, prevSettings: Settings) {
        super.onDidReceiveSettings(instance, settings, prevSettings)
        this.mute(instance, settings.mode === "pushToTalk")
    }

    protected deriveState(settings: Settings, instance?: Instance): State | undefined {
        return {
            muted: false
        }
    }

    protected instanceTitle(settings: Settings): string | undefined {
        return settings.track?.toString()
    }

    protected onKeyDown(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)
        switch (payload.settings.mode) {
            case "toggle": return this.mute(instance, !instance.state?.muted)
            case "pushToMute": return this.mute(instance, true)
            case "pushToTalk": return this.mute(instance, false)
        }
    }

    protected onKeyUp(instance: ActionInstance<Settings, State, object, object>, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyUp(instance, payload)
        switch (payload.settings.mode) {
            case "toggle": break
            case "pushToMute": return this.mute(instance, false)
            case "pushToTalk": return this.mute(instance, true)
        }
    }

    private mute(instance: Instance, mute: boolean) {
        const track = instance.settings.track
        const formattedTrack = track >= 10 ? `0${track}` : `00${track}`
        this.osc.send(`/action/_Ultraschall_${mute ? "Mute" : "UnMute"}_Track${formattedTrack}`)
        this.forEachInstance(i => {
            if (i.settings.track === instance.settings.track) {
                this.updateState(i, mute)
            }
        })
    }

    private updateState(instance: Instance, muted: boolean) {
        instance.state = { muted }
        if (instance.settings.mode === "pushToTalk") {
            instance.setImage(muted ? iconTalk : iconTalking)
        } else {
            instance.setImage(muted ? iconMuted : iconMute)
        }
    }
}