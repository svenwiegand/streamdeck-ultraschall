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