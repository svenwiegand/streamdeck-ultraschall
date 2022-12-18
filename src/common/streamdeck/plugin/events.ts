import {
    ActionReceiveEventBase,
    CommonActionReceiveEvent,
    CommonReceiveEvent,
    Coordinates,
    CommonSendEvent,
    Event, SendEventBase
} from "../common/events"

export interface ApplicationEvent extends Event {
    event: "applicationDidLaunch" | "applicationDidTerminate"
    payload: {
        application: string
    }
}

export interface DeviceDidConnect extends Event {
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

export interface ActionKeyEvent<Settings> extends ActionReceiveEventBase {
    event: "keyDown" | "keyUp"
    payload: {
        coordinates: Coordinates
        isInMultiAction: boolean
        settings: Settings
    }
}

export interface ActionTitleParametersDidChangeEvent<Settings> extends ActionReceiveEventBase {
    event: "titleParametersDidChange"
    payload: {
        coordinates: Coordinates
        settings: Settings
        state: number
        title: string
        titleParameters: unknown
    }
}

export interface ActionWillAppearEvent<Settings> extends ActionReceiveEventBase {
    event: "willAppear" | "willDisappear"
    payload: {
        controller: string
        coordinates: Coordinates
        state: string
        isInMultiAction: boolean
        settings: Settings
    }
}

export type ActionReceiveEvent<Settings extends object = object> =
    CommonActionReceiveEvent<Settings> |
    ActionKeyEvent<Settings> |
    ActionTitleParametersDidChangeEvent<Settings> |
    ActionWillAppearEvent<Settings>
export type ReceiveEvent =
    ActionReceiveEvent<object> |
    CommonReceiveEvent |
    ApplicationEvent |
    DeviceDidConnect


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