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

export interface KeyEvent<Settings> extends ActionReceiveEventBase {
    event: "keyDown" | "keyUp"
    payload: {
        settings: Settings
        coordinates: Coordinates
        state?: number
        userDesiredState: 0 | 1
        isInMultiAction: boolean
    }
}

export interface AppearanceEvent<Settings> extends ActionReceiveEventBase {
    event: "willAppear" | "willDisappear"
    payload: {
        settings: Settings
        coordinates: Coordinates
        state?: string
        isInMultiAction: boolean
    }
}

export interface TitleParametersDidChangeEvent<Settings> extends ActionReceiveEventBase {
    event: "titleParametersDidChange"
    payload: {
        settings: Settings
        coordinates: Coordinates
        state?: number
        title: string
        titleParameters: {
            fontFamily: string
            fontSize: number
            fontStyle: string
            fondUnderline: boolean
            showTitle: boolean
            titleAlignment: "top" | "middle" | "bottom"
            titleColor: string
        }
    }
}

export interface DeviceDidConnectEvent extends Event {
    event: "deviceDidConnect"
    device: string
    deviceInfo: {
        name: string
        type: number
        size: {
            columns: number
            rows: number
        }
    }
}

export interface DeviceDidDisconnectEvent extends Event {
    event: "deviceDidDisconnect"
    device: string
}

export interface ApplicationEvent extends Event {
    event: "applicationDidLaunch" | "applicationDidTerminate"
    payload: {
        application: string
    }
}

export interface SystemDidWakeUpEvent extends Event {
    event: "systemDidWakeUp"
}

export interface PropertyInspectorAppearanceEvent extends ActionReceiveEventBase {
    event: "propertyInspectorDidAppear" | "propertyInspectorDidDisappear"
}

export interface SendToPluginEvent<Payload> extends Event {
    event: "sendToPlugin"
    action: string
    context: string
    payload: Payload
}

// union types

export type ReceiveEvent<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> =
    CommonReceiveEvent<Settings, GlobalSettings> |
    KeyEvent<Settings> |
    AppearanceEvent<Settings> |
    TitleParametersDidChangeEvent<Settings> |
    DeviceDidConnectEvent |
    DeviceDidDisconnectEvent |
    ApplicationEvent |
    SystemDidWakeUpEvent |
    PropertyInspectorAppearanceEvent |
    SendToPluginEvent<Payload>


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

// union types

export type SendEvent<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> =
    CommonSendEvent<Settings> |
    SetTitleEvent