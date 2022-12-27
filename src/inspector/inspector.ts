import {PropertyInspector} from "streamdeck/inspector/PropertyInspector"
import {initLogging} from "common/logging"
import {RecordInspector} from "./inspectors/RecordInspector"
import {MuteInspector} from "./inspectors/MuteInspector"

export default function connectElgatoStreamDeckSocket(
    inPort: number,
    inPropertyInspectorUUID: string,
    inRegisterEvent: string,
    inInfo: string,
    inActionInfo: string) {
    initLogging()
    const inspector = new PropertyInspector(inPort, inRegisterEvent, inPropertyInspectorUUID, inActionInfo)
    inspector.registerInspector(
        new RecordInspector(),
        new MuteInspector(),
    )
}
