import {AbstractStreamdeckClient} from "../common/StreamdeckClient"
import {ReceiveEvent, SendEvent} from "./events"
import {ActionInspector} from "./ActionInspector"
import {Coordinates} from "../common/events"

export interface ActionInfo<Settings> {
    action: string
    context: string
    device: string
    payload: {
        settings: Settings
        coordinates: Coordinates
    }
}

export class PropertyInspector<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends AbstractStreamdeckClient<
    GlobalSettings,
    ReceiveEvent<Settings, GlobalSettings, Payload>,
    SendEvent<Settings, GlobalSettings, Payload>
> {
    protected readonly actionInfo: ActionInfo<Settings>
    protected connected = false
    protected inspector?: ActionInspector

    public constructor(port: number, event: string, uuid: string, actionInfo: string) {
        super(event, uuid, new WebSocket(`ws://127.0.0.1:${port}`))
        this.actionInfo = JSON.parse(actionInfo) as ActionInfo<Settings>
        this.on("connected", () => this.onConnected())
        console.log(`Created PropertyInspector for action ${this.actionInfo.action}`)
    }

    registerInspector(...inspectors: ActionInspector[]): void {
        inspectors.forEach(inspector => {
            if (inspector.uuid === this.actionInfo.action) {
                this.inspector = inspector
                inspector.client = this
                if (this.connected) {
                    inspector.render(this.actionInfo.payload.settings)
                }
            }
        })
    }

    protected onConnected() {
        if (!this.connected) {
            this.connected = true
            this.inspector?.render(this.actionInfo.payload.settings)
        }
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>): void {
        this.inspector?.emitReceiveEvent(event)
    }
}