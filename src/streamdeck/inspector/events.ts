import {CommonReceiveEvent, CommonSendEvent} from "../common/events"

///////////////////////////////////////////////////////////////////////////////
// receive

// union types

export type ReceiveEvent<Settings extends object> =
    CommonReceiveEvent<Settings>


///////////////////////////////////////////////////////////////////////////////
// send

// union types

export type SendEvent<Settings extends object> =
    CommonSendEvent<Settings>