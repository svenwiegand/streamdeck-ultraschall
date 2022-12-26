import {ArgumentType, createUDPPort, Message, UDPPort} from "./typedOsc"
import {EventEmitter} from "eventemitter3"

interface Settings {
    dawHost: string
    dawPort: number
    pluginHost: string
    pluginPort: number
}

export class Osc {
    private emitter = new EventEmitter<string>()
    private port: UDPPort | undefined
    private settings: Settings | undefined

    connect(dawHost: string, dawPort: number, pluginHost: string, pluginPort: number) {
        if (
            !this.settings ||
            this.settings.dawHost !== dawHost || this.settings.dawPort !== dawPort ||
            this.settings.pluginHost !== pluginHost || this.settings.pluginPort !== pluginPort
        ) {
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
    }

    close() {
        this.port?.close()
        this.port = undefined
    }

    send(address: string, ...args: ArgumentType[]) {
        this.port?.send({ address, args })
    }

    addListener(address: string, handle: (msg: Message) => void) {
        this.emitter.addListener(address, handle)
    }

    removeListener(address: string, handle: (msg: Message) => void) {
        this.emitter.removeListener(address, handle)
    }
}