import * as React from "react"
import {actionId, Settings} from "common/actions/record"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const onShowTimeChange = handler.onCheckboxChange(showTime => ({showTime}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item" {...{type:"checkbox"}}>
                <div className="sdpi-item-label">Display</div>
                <input id="showTitle" className="sdpi-item-value" type="checkbox" checked={handler.settings.showTime} onChange={onShowTimeChange}/>
                <label {...{for:"showTitle"}}><span/>Show recording time</label>
            </div>
            <div className="sdpi-item">
                <div className="sdpi-item-label empty"/>
                <details className="sdpi-item-value">
                    <summary>You need to leave the title empty to make this work.</summary>
                </details>
            </div>
        </InspectorWithGlobalSettings>
    )
}

export class RecordInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}