import {AbstractStreamdeckClient} from "../common/StreamdeckClient"
import {ReceiveEvent, SendEvent} from "./events"
import * as ws from "ws"
import {PluginAction} from "./PluginAction"

export class Plugin<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends AbstractStreamdeckClient<
    GlobalSettings,
    ReceiveEvent<Settings, GlobalSettings, Payload>,
    SendEvent<Settings, GlobalSettings, Payload>
> {
    protected readonly actions = new Map<string, PluginAction>()

    public constructor(port: number, event: string, uuid: string) {
        super(event, uuid, new ws.WebSocket(`ws://127.0.0.1:${port}`) as unknown as WebSocket)
    }

    protected onClose() {
        super.onClose()
        process.exit()
    }

    registerAction(...actions: PluginAction[]) {
        actions.forEach(action => {
            action.client = this
            this.actions.set(action.uuid, action)
        })
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>): void {
        if ("action" in event) {
            const action = this.actions.get(event.action)
            action?.receiveEvent(event)
        } else {
            this.actions.forEach(action => action.receiveEvent(event))
        }
    }
}