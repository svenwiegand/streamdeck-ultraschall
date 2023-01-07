import {OscAction} from "./OscAction"
import {Osc} from "../osc/Osc"
import {actionId, Settings} from "common/actions/record"
import {Message} from "../osc/typedOsc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {KeyEvent} from "streamdeck/plugin/events"
import iconRecord from "assets/images/key-record.svg"
import iconRecording from "assets/images/key-recording.svg"

interface State {
    recording: boolean
    time?: string
}

type Instance = ActionInstance<Settings, State>

export class RecordAction extends OscAction<Settings, State> {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected deriveState(settings: Settings, instance?: Instance): State {
        return {
            recording: false,
        }
    }

    protected onDidReceiveSettings(instance: Instance, settings: Settings, prevSettings: Settings) {
        super.onDidReceiveSettings(instance, settings, prevSettings)
        this.updateTitle(instance)
    }

    protected onKeyDown(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)
        this.osc.send("/record")
    }

    protected instanceOscSubscribeAddresses(settings: Settings): string[] {
        return ["/record", "/time/str"]
    }

    onOscMessage(instance: Instance, msg: Message) {
        super.onOscMessage(instance, msg)
        switch (msg.address) {
            case "/record": return this.onRecordState(instance, (msg.args?.[0] as number) > 0)
            case "/time/str": return this.onTimeChange(instance, msg.args?.[0] as string)
        }
        const timeCode = msg.args?.[0] as string
        this.forEachInstance(instance => {
            instance.setTitle(timeCode)
        })
    }

    private onRecordState(instance: Instance, recording: boolean) {
        instance.state.recording = recording
        instance.setImage(recording ? iconRecording : iconRecord)
        this.updateTitle(instance)
    }

    private onTimeChange(instance: Instance, time: string) {
        const timeWithoutMillis = time.split(".")[0]
        instance.state.time = timeWithoutMillis
        this.updateTitle(instance)
    }

    private updateTitle(instance: Instance) {
        instance.setTitle(instance.state.recording && instance.settings.showTime ? instance.state.time : "")
    }
}