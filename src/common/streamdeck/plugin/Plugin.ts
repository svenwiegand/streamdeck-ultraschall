import {AbstractStreamDeckClient} from "../common/AbstractStreamDeckClient"
import {isActionReceiveEvent, ReceiveEvent} from "./events"
import * as ws from "ws"
import {Action} from "./action"

export class Plugin extends AbstractStreamDeckClient<ReceiveEvent> {
    protected readonly actions = new Map<string, Action>()

    public constructor(port: number, event: string, uuid: string) {
        super(event, uuid, new ws.WebSocket(`ws://localhost:${port}`) as unknown as WebSocket)
    }

    registerAction(...actions: Action[]) {
        actions.forEach(action => {
            action.plugin = this
            this.actions.set(action.uuid, action)
        })
    }

    protected onClose() {
        super.onClose()
        process.exit()
    }

    protected onEvent(event: ReceiveEvent) {
        super.onEvent(event)
        if (isActionReceiveEvent(event)) {
            const action = this.actions.get(event.action)
            action?.emitReceiveEvent(event)
        }
    }
}