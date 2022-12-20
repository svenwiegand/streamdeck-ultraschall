import {ReceiveEvent, SendEvent} from "./events"
import {AbstractAction} from "../common/Action"

export abstract class PluginAction<Settings extends object = object> extends
    AbstractAction<ReceiveEvent<Settings>, SendEvent<Settings>>
{
    private contextSettings = new Map<string, Settings>()

    emitReceiveEvent(event: ReceiveEvent<Settings>) {
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
                this.sendEvent({...event, context} as SendEvent<Settings>)
            }
        })
    }
}

export type EventHandler<Settings extends object> =
    (event: ReceiveEvent<Settings>, action: PluginAction<Settings>) => void

export class SimplePluginAction<Settings extends object> extends PluginAction<Settings> {
    private readonly eventHandler: EventHandler<Settings>

    constructor(uuid: string, eventHandler: EventHandler<Settings>) {
        super(uuid)
        this.eventHandler = eventHandler
    }

    protected onEvent(event: ReceiveEvent<Settings>): void {
        this.eventHandler?.(event, this)
    }
}