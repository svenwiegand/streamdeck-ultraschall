import {AbstractStreamdeckClient} from "../common/StreamdeckClient"
import {ReceiveEvent} from "./events"
import * as ws from "ws"
import {PluginAction} from "./PluginAction"
import {isActionReceiveEvent} from "../common/events"

export class Plugin extends AbstractStreamdeckClient<ReceiveEvent> {
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

    protected onEvent(event: ReceiveEvent): void {
        if (isActionReceiveEvent(event)) {
            const action = this.actions.get(event.action)
            action?.emitReceiveEvent(event)
        }
    }
}