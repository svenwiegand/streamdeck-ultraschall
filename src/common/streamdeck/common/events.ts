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

export interface ActionReceiveEventBase extends Event {
    action: string
    context: string
    device: string
}

export interface DidReceiveSettingsEvent<Settings extends object> extends ActionReceiveEventBase {
    event: "didReceiveSettings"
    payload: {
        settings: Settings
        coordinates: Coordinates
        isInMultiAction: boolean
    }
}

export type CommonReceiveEvent =
    ConnectionEvent
export type CommonActionReceiveEvent<Settings extends object> =
    DidReceiveSettingsEvent<Settings>

export type EventHandler<E extends Event> = (e: E) => void

export interface SendEventBase extends Event {
    context: string
}

export interface SetSettingsEvent<Settings extends object> extends SendEventBase {
    event: "setSettings" | "setGlobalSettings"
    payload: Settings
}

export type CommonSendEvent<Settings extends object> =
    SetSettingsEvent<Settings>