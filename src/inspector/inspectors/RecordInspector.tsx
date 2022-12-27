import * as React from "react"
import {SDTextInput} from "react-streamdeck"
import {actionId, Settings} from "common/actions/transport"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {ReactActionInspector} from "./ReactActionInspector"

interface Props {
    name?: string
    onNameChange: (name: string) => void
    inspector: RecordInspector
}

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [name, setName] = React.useState(props.name ?? "Sven")
    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
        props.onNameChange?.(e.currentTarget.value)
    }
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <SDTextInput value={name} label={"Your name"} onChange={onNameChange} />
            <div>{name}</div>
        </InspectorWithGlobalSettings>
    )
}

export class RecordInspector extends ReactActionInspector<Props, Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }

    protected props(settings: Settings): Props {
        const onNameChange = (name: string) => this.setSettings({name})
        return {
            name: settings.name,
            onNameChange,
            inspector: this,
        }
    }
}