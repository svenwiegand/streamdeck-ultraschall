import * as React from "react"
import {SDTextInput} from "react-streamdeck"
import {StreamdeckClient} from "../../streamdeck/common/StreamdeckClient"
import {SendEvent} from "../../streamdeck/inspector/events"
import {actionId, Settings} from "../../common/actions/transport"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {GlobalSettings} from "../../common/actions/global"
import {ReactActionInspector} from "./ReactActionInspector"

interface Props {
    name?: string
    onNameChange: (name: string) => void
    client: StreamdeckClient<SendEvent<Settings, GlobalSettings>, GlobalSettings>
}

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [name, setName] = React.useState(props.name ?? "Sven")
    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
        props.onNameChange?.(e.currentTarget.value)
    }
    return (
        <InspectorWithGlobalSettings client={props.client}>
            <SDTextInput value={name} label={"Your name"} onChange={onNameChange} />
            <div>{name}</div>
        </InspectorWithGlobalSettings>
    )
}

const props = (settings: Settings, client: StreamdeckClient<SendEvent<Settings, GlobalSettings>, GlobalSettings>) => {
    const onNameChange = (name: string) => {
        client.sendEvent({
            event: "setSettings",
            context: client.uuid,
            payload: {name},
        })
    }
    return {
        name: settings.name,
        onNameChange,
        client,
    }
}

export const transportInspector = new ReactActionInspector(actionId, PropertyInspector, props)