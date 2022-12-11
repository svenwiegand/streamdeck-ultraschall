export interface UDPPortOptions {
    localPort?: number
    localAddress?: string
    remotePort?: number
    remoteAddress?: string
    metadata?: boolean
}
export interface TypedArgument {
    type: string;
    value: boolean | number | string;
}
export type ArgumentType = boolean | number | string | TypedArgument;
export interface Message {
    address: string
    args?: ArgumentType[]
}

export interface UDPPort {
    open()
    close()
    send(msg: Message)
    on(event: "ready", onReady: () => void)
    on(event: "message", onMessage: (msg: Message) => void)
}

export function createUDPPort(config: UDPPortOptions): UDPPort;
