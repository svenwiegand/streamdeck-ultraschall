import * as React from "react"
import {actionId, Settings} from "common/actions/record"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector} from "./ReactActionInspector"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [settings, setSettings] = React.useState(props.settings)
    const onShowTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
        const s = {showTime: e.currentTarget.checked}
        setSettings(s)
        props.onSettingsChange(s)
    }
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item" {...{type:"checkbox"}}>
                <div className="sdpi-item-label">Display</div>
                <input id="showTitle" className="sdpi-item-value" type="checkbox" checked={settings.showTime} onChange={onShowTimeChange}/>
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