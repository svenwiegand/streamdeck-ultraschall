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
    Props extends object,
    Settings extends object,
    Payload extends object = object
> extends ActionInspector<Settings, GlobalSettings, Payload> {
    protected readonly component: FunctionComponent<Props>

    constructor(
        uuid: string,
        component: FunctionComponent<Props>
    ) {
        super(uuid)
        this.component = component
    }

    protected abstract props(settings: Settings): Props

    render(settings: Settings) {
        const props = this.props(settings)
        const element = React.createElement(this.component, props)
        ReactDOM.render(element, document.getElementById("root"))
    }
}