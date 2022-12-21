import {EventHandler, SimpleActionInspector} from "../../streamdeck/inspector/ActionInspector"
import {GlobalSettings} from "../../common/actions/global"
import * as React from "react"
import {FunctionComponent} from "react"
import * as ReactDOM from "react-dom"
import {StreamdeckClient} from "../../streamdeck/common/StreamdeckClient"
import {SendEvent} from "../../streamdeck/inspector/events"

export class ReactActionInspector<
    Props extends object,
    Settings extends object,
    Payload extends object = object
> extends SimpleActionInspector<Settings, GlobalSettings, Payload> {
    constructor(
        uuid: string,
        component: FunctionComponent<Props>,
        props: (settings: Settings, client: StreamdeckClient<SendEvent<Settings, GlobalSettings>, GlobalSettings>) => Props,
        onEvent?: EventHandler<Settings, GlobalSettings, Payload>
    ) {
        const render = (
            settings: Settings,
            client: StreamdeckClient<SendEvent<Settings, GlobalSettings>, GlobalSettings>
        ) => {
            const element = React.createElement(component, props(settings, client))
            ReactDOM.render(element, document.getElementById("root"))
        }
        super(uuid, render, onEvent)
    }
}