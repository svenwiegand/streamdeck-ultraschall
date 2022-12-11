import {AbstractStreamDeckClient} from "../common/AbstractStreamDeckClient"
import {ReceiveEvent} from "./events"

export class PropertyInspector extends AbstractStreamDeckClient<ReceiveEvent> {
    public constructor(port: number, event: string, uuid: string) {
        super(event, uuid, new WebSocket(`ws://localhost:${port}`))
    }
}