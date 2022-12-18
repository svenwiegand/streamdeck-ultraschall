import {PropertyInspector} from "../streamdeck/inspector/PropertyInspector"
import {initLogging} from "../common/logging"
import {transportInspector} from "./inspectors/transport"

export default function connectElgatoStreamDeckSocket(
    inPort: number,
    inPropertyInspectorUUID: string,
    inRegisterEvent: string,
    inInfo: string,
    inActionInfo: string) {
    initLogging()
    const inspector = new PropertyInspector(inPort, inRegisterEvent, inPropertyInspectorUUID, inActionInfo)
    inspector.registerInspector(transportInspector)
}
