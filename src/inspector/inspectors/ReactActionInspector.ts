import {ActionInspector} from "streamdeck/inspector/ActionInspector"
import {GlobalSettings} from "common/actions/global"
import * as React from "react"
import {FunctionComponent} from "react"
import * as ReactDOM from "react-dom"

export interface InspectorProps<Settings extends object> {
    settings: Settings
    onSettingsChange: (settings: Settings) => void
    inspector: ActionInspector<Settings, GlobalSettings>
}

export abstract class ReactActionInspector<
    Settings extends object,
    Payload extends object = object
> extends ActionInspector<Settings, GlobalSettings, Payload> {
    protected readonly component: FunctionComponent<InspectorProps<Settings>>

    constructor(
        uuid: string,
        component: FunctionComponent<InspectorProps<Settings>>
    ) {
        super(uuid)
        this.component = component
    }

    protected props(settings: Settings): InspectorProps<Settings> {
        const onSettingsChange = (settings: Settings) => this.setSettings(settings)
        return {
            settings,
            onSettingsChange,
            inspector: this
        }
    }

    render(settings: Settings) {
        const props = this.props(settings)
        const element = React.createElement(this.component, props)
        ReactDOM.render(element, document.getElementById("root"))
    }
}

export class SettingsHandler<Settings extends object> {
    readonly props: InspectorProps<Settings>
    readonly settings: Settings
    readonly setSettings: React.Dispatch<React.SetStateAction<Settings>>

    constructor(props: InspectorProps<Settings>) {
        this.props = props
        const [settings, setSettings] = React.useState(props.settings)
        this.settings = settings
        this.setSettings = setSettings
    }

    updateSettings(changedSettings: Partial<Settings>) {
        const newSettings = {...this.settings, ...changedSettings}
        this.setSettings(newSettings)
        this.props.onSettingsChange(newSettings)
    }

    private onChange<ElementType, EventValue, Value extends EventValue>(
        valueOf: (e: ElementType) => EventValue,
        onChange: (value: Value) => Partial<Settings> | undefined
    ) {
        return (e: React.FormEvent<ElementType>) => {
            const settings = onChange(valueOf(e.currentTarget) as Value)
            if (settings) {
                this.updateSettings(settings)
            }
        }
    }

    onInputChange<Value extends string>(onChange: (value: Value) => Partial<Settings> | undefined) {
        return this.onChange<{value: string}, string, Value>(e => e.value, onChange)
    }

    onCheckboxChange<Value extends boolean>(onChange: (value: Value) => Partial<Settings | undefined>) {
        return this.onChange<{checked: boolean}, boolean, Value>(e => e.checked, onChange)
    }
}