import { EventEmitter } from "eventemitter3"
import { Event, EventHandler } from "./events"

export abstract class AbstractStreamDeckClient<ReceiveEvent extends Event> {
    private websockt: WebSocket
    protected eventEmitter: EventEmitter<string>

    protected constructor(event: string, uuid: string, websocket: WebSocket) {
        this.eventEmitter = new EventEmitter()
        this.websockt = websocket
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
            this.eventEmitter.emit(event.event, event)
        }
    }

    protected onClose() {
        console.log("websocket closed")
        this.eventEmitter.emit("disconnected")
    }

    on<E extends ReceiveEvent, EName extends E["event"]>(event: EName, handle: EventHandler<E>) {
        this.eventEmitter.on(event, handle)
    }

    sendEvent<E>(event: E) {
        this.websockt.send(JSON.stringify(event))
    }
}