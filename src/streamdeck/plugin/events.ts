import {
    ActionReceiveEventBase,
    CommonReceiveEvent,
    CommonSendEvent,
    Coordinates,
    Event,
    SendEventBase
} from "../common/events"

///////////////////////////////////////////////////////////////////////////////
// receive

// concrete types

export interface ApplicationEvent extends Event {
    event: "applicationDidLaunch" | "applicationDidTerminate"
    payload: {
        application: string
    }
}

export interface DeviceDidConnectEvent extends Event {
    event: "deviceDidConnect"
    device: string
    deviceInfo: {
        name: string
        size: {
            columns: number
            rows: number
        }
        type: number
    }
}

export interface KeyEvent<Settings> extends ActionReceiveEventBase {
    event: "keyDown" | "keyUp"
    payload: {
        coordinates: Coordinates
        isInMultiAction: boolean
        settings: Settings
    }
}

export interface TitleParametersDidChangeEvent<Settings> extends ActionReceiveEventBase {
    event: "titleParametersDidChange"
    payload: {
        coordinates: Coordinates
        settings: Settings
        state: number
        title: string
        titleParameters: unknown
    }
}

export interface WillAppearEvent<Settings> extends ActionReceiveEventBase {
    event: "willAppear" | "willDisappear"
    payload: {
        controller: string
        coordinates: Coordinates
        state: string
        isInMultiAction: boolean
        settings: Settings
    }
}

// union types

export type ReceiveEvent<Settings extends object> =
    CommonReceiveEvent<Settings> |
    KeyEvent<Settings> |
    TitleParametersDidChangeEvent<Settings> |
    WillAppearEvent<Settings> |
    ApplicationEvent |
    DeviceDidConnectEvent


///////////////////////////////////////////////////////////////////////////////
// send

// concrete types

export interface SetTitleEvent extends SendEventBase {
    event: "setTitle"
    payload: {
        title: string
        target: "software" | "hardware" | "both"
        state: number
    }
}

export type SendEvent<Settings extends object> =
    CommonSendEvent<Settings> |
    SetTitleEvent