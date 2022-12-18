import {CommonActionReceiveEvent, CommonReceiveEvent, CommonSendEvent} from "../common/events"

export type ReceiveEvent<Settings extends object> =
    CommonReceiveEvent |
    CommonActionReceiveEvent<Settings>

export type SendEvent<Settings extends object> =
    CommonSendEvent<Settings>