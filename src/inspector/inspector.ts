import * as React from "react"
import * as ReactDOM from "react-dom"
import {propertyInspector} from "./PropertyInspector"
import {PropertyInspector} from "../streamdeck/inspector/PropertyInspector"
import {initLogging} from "../common/logging"
import {SimpleActionInspector} from "../streamdeck/inspector/ActionInspector"
import {StreamdeckClient} from "../streamdeck/common/StreamdeckClient"
import {action} from "../common/action"

function render(name: string | undefined, onNameChange: (name: string) => void) {
    ReactDOM.render(React.createElement(propertyInspector, { name, onNameChange }), document.getElementById("root"))
}

function renderer(client: StreamdeckClient) {
    const onChange = (name: string) => {
        client.sendEvent({
            event: "setSettings",
            context: client.uuid,
            payload: {name},
        })
    }
    render("Sven", onChange)
}

export default function connectElgatoStreamDeckSocket(
    inPort: number,
    inPropertyInspectorUUID: string,
    inRegisterEvent: string,
    inInfo: string,
    inActionInfo: string) {
    initLogging()
    const inspector = new PropertyInspector(inPort, inRegisterEvent, inPropertyInspectorUUID, inActionInfo)
    inspector.registerInspector(new SimpleActionInspector(action.transport, renderer))
}
