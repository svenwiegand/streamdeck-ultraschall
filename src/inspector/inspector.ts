import * as React from "react"
import * as ReactDOM from "react-dom"
import {propertyInspector} from "./PropertyInspector"

function render(name: string | undefined, onNameChange: (name: string) => void) {
    ReactDOM.render(React.createElement(propertyInspector, { name, onNameChange }), document.getElementById("root"))
}

export default function connectElgatoStreamDeckSocket(
    inPort: number,
    inPropertyInspectorUUID: string,
    inRegisterEvent: string,
    inInfo: unknown,
    inActionInfo: unknown) {
    const websocket = new WebSocket(`ws://localhost:${inPort}`)
    const onChange = (name: string) => {
        websocket.send(JSON.stringify({
            event: "setSettings",
            context: inPropertyInspectorUUID,
            payload: {name}
        }))
    }
    websocket.onopen = () => {
        const payload = {
            event: inRegisterEvent,
            uuid: inPropertyInspectorUUID,
        }
        websocket.send(JSON.stringify(payload))
        render("Sven", onChange)
    }
    websocket.onmessage = event => {
        const msg = JSON.parse(event.data.toString())
        console.log(msg)
    }
}
