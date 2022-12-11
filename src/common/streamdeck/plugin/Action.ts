import {ActionReceiveEvent, SendEvent} from "./events"
import {Plugin as PluginClass} from "./plugin"

export abstract class Action<Settings extends object = object, Plugin extends PluginClass = PluginClass> {
    public readonly uuid: string
    public plugin: Plugin | undefined
    private contextSettings = new Map<string, Settings>()

    protected constructor(uuid: string) {
        this.uuid = uuid
    }

    public emitReceiveEvent(event: ActionReceiveEvent<Settings>) {
        switch (event.event) {
            case "didReceiveSettings":
            case "willAppear":
            case "willDisappear":
                this.contextSettings.set(event.context, event.payload.settings)
                break
            default:
        }
        this.onEvent(event)
    }

    protected abstract onEvent(event: ActionReceiveEvent<Settings>): void

    protected sendEvent(event: SendEvent<Settings>) {
        this.plugin?.sendEvent(event)
    }

    protected sendEventToAllInstances<
        E extends SendEvent<Settings>
    >(event: E, filter: (settings: Settings, context: string) => boolean = () => true) {
        this.contextSettings.forEach((settings, context) => {
            if (filter(settings, context)) {
                this.sendEvent({...event, context})
            }
        })
    }
}