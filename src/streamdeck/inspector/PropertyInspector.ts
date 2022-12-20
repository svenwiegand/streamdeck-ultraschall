import {AbstractStreamdeckClient} from "../common/StreamdeckClient"
import {ReceiveEvent, SendEvent} from "./events"
import {ActionInspector} from "./ActionInspector"
import {Coordinates} from "../common/events"

export interface ActionInfo {
    action: string
    context: string
    device: string
    payload: {
        settings: object
        coordinates: Coordinates
    }
}

export class PropertyInspector extends
    AbstractStreamdeckClient<ReceiveEvent<object>, SendEvent<object>> {
    protected readonly actionInfo: ActionInfo
    protected connected = false
    protected inspector?: ActionInspector<object>

    public constructor(port: number, event: string, uuid: string, actionInfo: string) {
        super(event, uuid, new WebSocket(`ws://127.0.0.1:${port}`))
        this.actionInfo = JSON.parse(actionInfo) as ActionInfo
        this.on("connected", () => this.onConnected())
        console.log(`Created PropertyInspector for action ${this.actionInfo.action}`)
    }

    registerInspector(...inspectors: ActionInspector<object>[]): void {
        inspectors.forEach(inspector => {
            if (inspector.uuid === this.actionInfo.action) {
                this.inspector = inspector
                inspector.client = this
                if (this.connected) {
                    inspector.render()
                }
            }
        })
    }

    protected onConnected() {
        if (!this.connected) {
            this.connected = true
            this.inspector?.render()
        }
    }

    protected onEvent(event: ReceiveEvent<object>): void {
        this.inspector?.emitReceiveEvent(event)
    }
}