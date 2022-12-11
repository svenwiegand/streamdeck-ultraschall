import {CommonReceiveEvent, CommonSendEvent} from "../common/events"

export type ReceiveEvent =
    CommonReceiveEvent
export type SendEvent<Settings extends object> =
    CommonSendEvent<Settings>