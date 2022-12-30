import {ArgumentType, createUDPPort, Message, UDPPort} from "./typedOsc"
import {EventEmitter} from "eventemitter3"

export class Osc {
    private emitter = new EventEmitter<string>()
    private port: UDPPort | undefined

    connect(dawHost: string, dawPort: number, pluginHost: string, pluginPort: number) {
        this.close()
        const port = createUDPPort({
            remoteAddress: dawHost,
            remotePort: dawPort,
            localAddress: pluginHost,
            localPort: pluginPort,
        })
        port.on("ready", () => {
            this.port = port
            console.log(`Listening for OSC on ${pluginHost}:${pluginPort}`)
        })
        port.on("error", (error) => {
            console.error(`OSC error ${error.message}`)
            this.port = undefined
        })
        port.on("message", (msg) => {
            console.debug(msg)
            this.emitter.emit(msg.address, msg)
        })
        port.open()
    }

    close() {
        this.port?.close()
        this.port = undefined
    }

    send(address: string, ...args: ArgumentType[]) {
        const msg = {address, args}
        console.debug(msg)
        this.port?.send(msg)
    }

    addListener(address: string, handle: (msg: Message) => void) {
        this.emitter.addListener(address, handle)
    }

    removeListener(address: string, handle: (msg: Message) => void) {
        this.emitter.removeListener(address, handle)
    }
}