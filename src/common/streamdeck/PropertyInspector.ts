import {AbstractStreamDeckClient} from "./AbstractStreamDeckClient"
import {PropertyInspectorEvent} from "./events/receive"

export class PropertyInspector extends AbstractStreamDeckClient<PropertyInspectorEvent> {
    public constructor(port: number, event: string, uuid: string) {
        super(event, uuid, new WebSocket(`ws://localhost:${port}`))
    }
}