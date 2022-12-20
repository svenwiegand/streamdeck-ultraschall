import {EventEmitter} from "eventemitter3"
import {Event, SendEventBase} from "./events"

type EventHandler<E extends Event> = (e: E) => void

export interface StreamdeckClient<SendEvent extends SendEventBase> {
    readonly uuid: string
    sendEvent(event: SendEvent): void
}

export abstract class AbstractStreamdeckClient<
    ReceiveEvent extends Event,
    SendEvent extends SendEventBase
> implements StreamdeckClient<SendEvent> {
    public readonly uuid: string
    private readonly websocket: WebSocket
    protected readonly eventEmitter: EventEmitter<string>

    protected constructor(event: string, uuid: string, websocket: WebSocket) {
        this.uuid = uuid
        this.eventEmitter = new EventEmitter()
        this.websocket = websocket
        websocket.onopen = () => {
            console.log("websocket open")
            const payload = {event, uuid}
            websocket.send(JSON.stringify(payload))
            this.eventEmitter.emit("connected")
        }
        websocket.onclose = this.onClose
        websocket.onmessage = (msg: MessageEvent<ReceiveEvent>) => {
            const event = JSON.parse(msg.data.toString())
            console.debug(event)
            this.onEvent(event)
            this.eventEmitter.emit(event.event, event)
        }
    }

    protected onClose() {
        console.log("websocket closed")
        this.eventEmitter.emit("disconnected")
    }

    protected abstract onEvent(event: ReceiveEvent): void

    on<E extends ReceiveEvent, EName extends E["event"]>(event: EName, handle: EventHandler<E>) {
        this.eventEmitter.on(event, handle)
    }

    sendEvent<E extends SendEventBase>(event: E) {
        const json = JSON.stringify(event)
        this.websocket.send(json)
    }
}