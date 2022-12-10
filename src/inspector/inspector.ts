import * as React from "react"
import * as ReactDOM from "react-dom"
import {propertyInspector} from "./PropertyInspector"
import {PropertyInspector} from "../common/streamdeck/inspector/PropertyInspector"

function render(name: string | undefined, onNameChange: (name: string) => void) {
    ReactDOM.render(React.createElement(propertyInspector, { name, onNameChange }), document.getElementById("root"))
}

export default function connectElgatoStreamDeckSocket(
    inPort: number,
    inPropertyInspectorUUID: string,
    inRegisterEvent: string,
    inInfo: unknown,
    inActionInfo: unknown) {
    const inspector = new PropertyInspector(inPort, inRegisterEvent, inPropertyInspectorUUID)
    const onChange = (name: string) => {
        inspector.sendEvent({
            event: "setSettings",
            context: inPropertyInspectorUUID,
            payload: {name},
        })
    }
    inspector.on("connected", () => render("Sven", onChange))
}
