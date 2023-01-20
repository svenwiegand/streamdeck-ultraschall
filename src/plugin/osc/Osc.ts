import {ArgumentType, createUDPPort, Message, UDPPort} from "./typedOsc"
import {EventEmitter} from "eventemitter3"

export interface OscMessage extends Message {
    readonly address: string
    readonly args?: ArgumentType[]
    readonly pathMatch?: string
}

type OscMessageListener = (msg: OscMessage) => void

class PathPattern {
    readonly pathStart: string
    readonly pathEnd: string

    constructor(readonly pattern: string) {
        const pathSegments = pattern.split("*")
        if (pathSegments.length !== 2) {
            throw "Path must contain exactly one path segment wildcard '*'"
        }
        this.pathStart = pathSegments[0]
        this.pathEnd = pathSegments[1]
    }

    match(address: string): string | undefined {
        if (address.startsWith(this.pathStart) && address.endsWith(this.pathEnd)) {
            return address.substring(this.pathStart.length, address.length - this.pathEnd.length)
        } else {
            return undefined
        }
    }
}

interface PathPatternListeners {
    pathPattern: PathPattern
    listeners: Set<OscMessageListener>
}

export class Osc {
    private emitter = new EventEmitter<string>()
    private pathPatternListeners = new Map<string, PathPatternListeners>()
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
        port.on("message", msg => this.onOscMessage(msg))
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

    addListener(address: string, handle: (msg: OscMessage) => void) {
        this.emitter.addListener(address.toString(), handle)
    }

    removeListener(address: string | RegExp, handle: (msg: OscMessage) => void) {
        this.emitter.removeListener(address.toString(), handle)
    }

    addPatternListener(addressWithPlaceholder: string, handle: (msg: OscMessage) => void) {
        const listeners: PathPatternListeners | undefined = this.pathPatternListeners.get(addressWithPlaceholder)
        if (listeners) {
            listeners.listeners.add(handle)
        } else {
            const pathPattern = new PathPattern(addressWithPlaceholder)
            const listeners = new Set<OscMessageListener>([handle])
            this.pathPatternListeners.set(addressWithPlaceholder, {pathPattern, listeners})
        }
    }

    removePatternListener(addressWithPlaceholder: string, handle: (msg: OscMessage) => void) {
        const listeners: PathPatternListeners | undefined = this.pathPatternListeners.get(addressWithPlaceholder)
        if (listeners) {
            listeners.listeners.delete(handle)
            if (listeners.listeners.size === 0) {
                this.pathPatternListeners.delete(addressWithPlaceholder)
            }
        }
    }

    private onOscMessage(msg: Message) {
        console.debug(msg)
        this.emitter.emit(msg.address, msg)
        this.pathPatternListeners.forEach(listeners => {
            const pathMatch = listeners.pathPattern.match(msg.address)
            if (pathMatch) {
                const message: OscMessage = {...msg, pathMatch}
                listeners.listeners.forEach(listener => listener(message))
            }
        })
    }
}