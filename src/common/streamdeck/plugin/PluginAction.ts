import {ActionReceiveEvent, SendEvent} from "./events"
import {AbstractAction} from "../common/Action"

export abstract class PluginAction<Settings extends object = object> extends
    AbstractAction<ActionReceiveEvent<Settings>, SendEvent<Settings>>
{
    private contextSettings = new Map<string, Settings>()

    public emitReceiveEvent(event: ActionReceiveEvent<Settings>) {
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