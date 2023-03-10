import {CommonReceiveEvent, CommonSendEvent, EventWithContext} from "../common/events"

///////////////////////////////////////////////////////////////////////////////
// receive

// concrete types

export interface SendToPropertyInspectorEvent<Payload extends object> extends Event {
    event: "sendToPropertyInspector"
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
    SendToPropertyInspectorEvent<Payload>

///////////////////////////////////////////////////////////////////////////////
// send

// concrete types

export interface SendToPluginEvent<Payload extends object> extends EventWithContext {
    event: "sendToPlugin"
    action: string
    payload: Payload
}

// union types

export type SendEvent<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object,
> =
    CommonSendEvent<Settings, GlobalSettings> |
    SendToPluginEvent<Payload>