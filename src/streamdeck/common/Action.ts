import {Event, SendEventBase} from "./events"
import {StreamdeckClient} from "./StreamdeckClient"

export interface Action<ReceiveEvent extends Event, SendEvent extends SendEventBase> {
    readonly uuid: string
    client: StreamdeckClient<SendEvent> | undefined
    emitReceiveEvent(event: ReceiveEvent): void
    sendEvent(event: SendEvent): void
}

export abstract class AbstractAction<
    ReceiveEvent extends Event,
    SendEvent extends SendEventBase,
> implements Action<ReceiveEvent, SendEvent> {
    public readonly uuid: string
    public client: StreamdeckClient<SendEvent> | undefined

    protected constructor(uuid: string) {
        this.uuid = uuid
    }

    /**
     * Will be called by concrete [AbstractStreamDeckClient] implementation, when event is received.
     */
    public emitReceiveEvent(event: ReceiveEvent) {
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