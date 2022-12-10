import {AbstractStreamDeckClient} from "../common/AbstractStreamDeckClient"
import {PropertyInspectorReceiveEvent} from "./events"

export class PropertyInspector extends AbstractStreamDeckClient<PropertyInspectorReceiveEvent<any>> { //TODO
    public constructor(port: number, event: string, uuid: string) {
        super(event, uuid, new WebSocket(`ws://localhost:${port}`))
    }
}