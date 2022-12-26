import {Event} from "./events"
import {StreamdeckClient} from "./StreamdeckClient"

export interface Action<ReceiveEvent extends Event, SendEvent extends Event, GlobalSettings extends object> {
    readonly uuid: string
    client: StreamdeckClient<SendEvent, GlobalSettings> | undefined
    receiveEvent(event: ReceiveEvent): void
    sendEvent(event: SendEvent): void
}

export abstract class AbstractAction<
    ReceiveEvent extends Event,
    SendEvent extends Event,
    GlobalSettings extends object
> implements Action<ReceiveEvent, SendEvent, GlobalSettings> {
    public readonly uuid: string
    public client: StreamdeckClient<SendEvent, GlobalSettings> | undefined

    protected constructor(uuid: string) {
        this.uuid = uuid
    }

    /**
     * Will be called by concrete [AbstractStreamDeckClient] implementation, when event is received.
     */
    public receiveEvent(event: ReceiveEvent) {
        this.onEvent(event)
    }

    /**
     * Called when an event is received.
     */
    protected abstract onEvent(event: ReceiveEvent): void

    sendEvent(event: SendEvent) {
        this.client?.sendEvent(event)
    }
}