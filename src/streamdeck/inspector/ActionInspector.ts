import {AbstractAction} from "../common/Action"
import {ReceiveEvent, SendEvent} from "./events"
import {StreamdeckClient} from "../common/StreamdeckClient"

export abstract class ActionInspector<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends AbstractAction<
    ReceiveEvent<Settings, GlobalSettings, Payload>,
    SendEvent<Settings, GlobalSettings, Payload>,
    GlobalSettings
> {
    abstract render(settings: Settings): void
}

export type InspectorRenderer<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> = (
    settings: Settings,
    client: StreamdeckClient<SendEvent<Settings, GlobalSettings, Payload>, GlobalSettings>
) => void

export type EventHandler<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> = (
    event: ReceiveEvent<Settings, GlobalSettings, Payload>,
    client: StreamdeckClient<SendEvent<Settings, GlobalSettings, Payload>, GlobalSettings>
) => void

export class SimpleActionInspector<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends ActionInspector<Settings, GlobalSettings, Payload> {
    private readonly renderer: InspectorRenderer<Settings, GlobalSettings, Payload>
    private readonly eventHandler?: EventHandler<Settings, GlobalSettings, Payload>

    constructor(
        uuid: string,
        render: InspectorRenderer<Settings, GlobalSettings, Payload>,
        onEvent?: EventHandler<Settings, GlobalSettings, Payload>
    ) {
        super(uuid)
        this.renderer = render
        this.eventHandler = onEvent
    }

    render(settings: Settings): void {
        if (this.client) {
            this.renderer(settings, this.client)
        }
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>) {
        if (this.client) {
            this.eventHandler?.(event, this.client)
        }
    }
}