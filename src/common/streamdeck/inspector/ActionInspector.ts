import {AbstractAction} from "../common/Action"
import {ReceiveEvent, SendEvent} from "./events"
import {StreamdeckClient} from "../common/StreamdeckClient"

export abstract class ActionInspector<Settings extends object = object> extends
    AbstractAction<ReceiveEvent<Settings>, SendEvent<Settings>> {
    abstract render(): void
}

type InspectorRenderer = (client: StreamdeckClient) => void
type EventHandler<Settings extends object> = (event: ReceiveEvent<Settings>) => void

export class SimpleActionInspector<Settings extends object> extends
    ActionInspector<Settings> {

    private readonly renderer: InspectorRenderer
    private readonly eventHandler?: EventHandler<Settings>

    constructor(uuid: string, render: InspectorRenderer, onEvent?: EventHandler<Settings>) {
        super(uuid)
        this.renderer = render
        this.eventHandler = onEvent
    }

    render(): void {
        if (this.client) {
            this.renderer(this.client)
        }
    }

    protected onEvent(event: ReceiveEvent<Settings>) {
        if (this.eventHandler) {
            this.eventHandler(event)
        }
    }
}