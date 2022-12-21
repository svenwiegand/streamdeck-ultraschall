import {ReceiveEvent, SendEvent} from "./events"
import {AbstractAction} from "../common/Action"

export abstract class PluginAction<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends AbstractAction<
    ReceiveEvent<Settings, GlobalSettings, Payload>,
    SendEvent<Settings, GlobalSettings, Payload>,
    GlobalSettings
>
{
    private contextSettings = new Map<string, Settings>()

    emitReceiveEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>) {
        switch (event.event) {
            case "didReceiveSettings":
            case "willAppear":
            case "willDisappear":
                this.contextSettings.set(event.context, event.payload.settings)
                break
            default:
        }
        super.emitReceiveEvent(event)
    }

    sendEventToAllInstances<
        E extends Omit<SendEvent<Settings>, "context">
    >(event: E, filter: (settings: Settings, context: string) => boolean = () => true) {
        this.contextSettings.forEach((settings, context) => {
            if (filter(settings, context)) {
                this.sendEvent({...event, context} as SendEvent<Settings, GlobalSettings, Payload>)
            }
        })
    }
}

type EventHandler<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> = (
    event: ReceiveEvent<Settings, GlobalSettings, Payload>,
    action: PluginAction<Settings, GlobalSettings, Payload>
) => void

export class SimplePluginAction<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends PluginAction<Settings, GlobalSettings, Payload> {
    private readonly eventHandler: EventHandler<Settings, GlobalSettings, Payload>

    constructor(uuid: string, eventHandler: EventHandler<Settings, GlobalSettings, Payload>) {
        super(uuid)
        this.eventHandler = eventHandler
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>): void {
        this.eventHandler?.(event, this)
    }
}