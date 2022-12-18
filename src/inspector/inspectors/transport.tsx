import * as React from "react"
import {SDTextInput} from "react-streamdeck"
import * as ReactDOM from "react-dom"
import {StreamdeckClient} from "../../streamdeck/common/StreamdeckClient"
import {SendEvent} from "../../streamdeck/inspector/events"
import {SimpleActionInspector} from "../../streamdeck/inspector/ActionInspector"
import {actionId, Settings} from "../../common/actions/transport"

interface Props {
    name?: string
    onNameChange: (name: string) => void
}

const propertyInspector: React.FC<Props> = (props: Props) => {
    const [name, setName] = React.useState(props.name ?? "Sven")
    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
        props.onNameChange?.(e.currentTarget.value)
    }
    return (
        <>
            <SDTextInput value={name} label={"Your name"} onChange={onNameChange} />
            <div>Hello {name}!</div>
        </>
    )
}

function render(client: StreamdeckClient<SendEvent<Settings>>) {
    const onNameChange = (name: string) => {
        client.sendEvent({
            event: "setSettings",
            context: client.uuid,
            payload: {name},
        })
    }
    ReactDOM.render(React.createElement(propertyInspector, {name: "Sven", onNameChange}), document.getElementById("root"))
}

export const transportInspector = new SimpleActionInspector(actionId, render)