import {ActionReceiveEvent, CommonReceiveEvent, Coordinates} from "../common/events"

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

export interface ActionKeyEvent<Settings> extends ActionReceiveEvent {
    event: "keyDown" | "keyUp"
    payload: {
        coordinates: Coordinates
        isInMultiAction: boolean
        settings: Settings
    }
}

export interface ActionTitleParametersDidChange<Settings> extends ActionReceiveEvent {
    event: "titleParametersDidChange"
    payload: {
        coordinates: Coordinates
        settings: Settings
        state: number
        title: string
        titleParameters: unknown
    }
}

export interface ActionWillAppear<Settings> extends ActionReceiveEvent {
    event: "willAppear"
    payload: {
        controller: string
        coordinates: Coordinates
        isInMultiAction: boolean
        settings: Settings
    }
}

export type PluginReceiveEvent<Settings extends object> =
    CommonReceiveEvent<Settings> |
    ApplicationEvent |
    DeviceDidConnect |
    ActionKeyEvent<Settings> |
    ActionTitleParametersDidChange<Settings> |
    ActionWillAppear<Settings>