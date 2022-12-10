export interface Event {
    event: string
}

export interface ConnectionEvent extends Event {
    event: "connected" | "disconnected"
}

export interface Coordinates {
    column: number
    row: number
}

export interface ActionReceiveEvent extends Event {
    action: string
    context: string
    device: string
}

export interface DidReceiveSettingsEvent<Settings extends object> extends ActionReceiveEvent {
    event: "didReceiveSettings"
    payload: {
        settings: Settings
        coordinates: Coordinates
        isInMultiAction: boolean
    }
}

export type CommonReceiveEvent<Settings extends object> =
    ConnectionEvent |
    DidReceiveSettingsEvent<Settings>

export type EventHandler<E extends Event> = (e: E) => void