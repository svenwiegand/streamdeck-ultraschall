import {EventEmitter} from "eventemitter3"
import {DidReceiveGlobalSettingsEvent, Event} from "./events"

type EventHandler<E extends Event> = (e: E) => void

export interface StreamdeckClient<
    SendEvent extends Event,
    GlobalSettings extends object = object
> {
    readonly uuid: string
    sendEvent(event: SendEvent): void
    setGlobalSettings(settings: GlobalSettings): void
    getGlobalSettings(): Promise<GlobalSettings>
    openUrl(url: string): void
    logMessage(message: string): void
}

export abstract class AbstractStreamdeckClient<
    GlobalSettings extends object,
    ReceiveEvent extends Event,
    SendEvent extends Event
> implements StreamdeckClient<SendEvent, GlobalSettings> {
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

    sendEvent<E extends Event>(event: E) {
        const json = JSON.stringify(event)
        this.websocket.send(json)
    }

    getGlobalSettings(): Promise<GlobalSettings> {
        return new Promise<GlobalSettings>(resolve => {
            const eventHandler = (event: DidReceiveGlobalSettingsEvent<GlobalSettings>) => {
                this.eventEmitter.off("didReceiveGlobalSettings", eventHandler)
                resolve(event.payload.settings)
            }
            this.eventEmitter.on("didReceiveGlobalSettings", eventHandler)
            this.sendEvent({ event: "getGlobalSettings", context: this.uuid })
        })
    }

    setGlobalSettings(settings: GlobalSettings): void {
        this.sendEvent({
            event: "setGlobalSettings",
            context: this.uuid,
            payload: settings,
        })
    }

    openUrl(url: string): void {
        this.sendEvent({
            event: "openUrl",
            payload: {url}
        })
    }

    logMessage(message: string): void {
        this.sendEvent({
            event: "logMessage",
            payload: {message}
        })
    }
}