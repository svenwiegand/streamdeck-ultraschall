export interface Event {
    event: string
}

///////////////////////////////////////////////////////////////////////////////
// receive

// data types

export interface Coordinates {
    column: number
    row: number
}

// base types

export interface ActionReceiveEventBase extends Event {
    action: string
    context: string
}

// concrete types

export interface ConnectionEvent extends Event {
    event: "connected" | "disconnected"
}

export interface DidReceiveSettingsEvent<Settings extends object> extends ActionReceiveEventBase {
    event: "didReceiveSettings"
    payload: {
        settings: Settings
        coordinates: Coordinates
        isInMultiAction: boolean
    }
}

// union types

export type CommonReceiveEvent<Settings extends object> =
    ConnectionEvent |
    DidReceiveSettingsEvent<Settings>


///////////////////////////////////////////////////////////////////////////////
// send

// base types

export interface SendEventBase extends Event {
    context: string
}

// concrete types

export interface SetSettingsEvent<Settings extends object> extends SendEventBase {
    event: "setSettings" | "setGlobalSettings"
    payload: Settings
}

// union types

export type CommonSendEvent<Settings extends object> =
    SetSettingsEvent<Settings>