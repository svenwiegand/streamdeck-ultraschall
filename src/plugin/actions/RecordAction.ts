import {OscAction} from "./OscAction"
import {Osc} from "../osc/Osc"
import {actionId, Settings} from "common/actions/record"
import {Message} from "../osc/typedOsc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {KeyEvent} from "streamdeck/plugin/events"
import iconRecord from "assets/images/key-record.svg"
import iconRecording from "assets/images/key-recording.svg"

type Instance = ActionInstance<Settings>

export class RecordAction extends OscAction<Settings> {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected onDidReceiveSettings(instance: Instance, settings: Settings, prevSettings: Settings) {
        super.onDidReceiveSettings(instance, settings, prevSettings)
        if (!settings.showTime) {
            instance.setTitle("")
        }
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

    private onRecordState(instance: Instance, record: boolean) {
        instance.setImage(record ? iconRecording : iconRecord)
    }

    private onTimeChange(instance: Instance, time: string) {
        if (instance.settings.showTime) {
            const timeWithoutMillis = time.split(".")[0]
            instance.setTitle(timeWithoutMillis)
        }
    }
}