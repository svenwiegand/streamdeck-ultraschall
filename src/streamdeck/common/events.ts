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
    device: string
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

export interface DidReceiveGlobalSettingsEvent<GlobalSettings extends object> extends Event {
    event: "didReceiveGlobalSettings"
    payload: {
        settings: GlobalSettings
    }
}

// union types

export type CommonReceiveEvent<Settings extends object, GlobalSettings extends object> =
    ConnectionEvent |
    DidReceiveSettingsEvent<Settings> |
    DidReceiveGlobalSettingsEvent<GlobalSettings>


///////////////////////////////////////////////////////////////////////////////
// send

// base types

export interface EventWithContext extends Event {
    context: string
}

// concrete types

export interface SetSettingsEvent<Settings extends object> extends EventWithContext {
    event: "setSettings"
    payload: Settings
}

export interface SetGlobalSettingsEvent<GlobalSettings extends object> extends EventWithContext {
    event: "setGlobalSettings"
    payload: GlobalSettings
}

export interface GetSettingsEvent extends EventWithContext {
    event: "getSettings" | "getGlobalSettings"
}

export interface OpenUrlEvent extends Event {
    event: "openUrl",
    payload: {
        url: string
    }
}

export interface LogMessageEvent extends Event {
    event: "logMessage",
    payload: {
        message: string
    }
}

// union types

export type CommonSendEvent<Settings extends object, GlobalSettings extends object> =
    SetSettingsEvent<Settings> |
    SetGlobalSettingsEvent<GlobalSettings> |
    GetSettingsEvent |
    OpenUrlEvent |
    LogMessageEvent