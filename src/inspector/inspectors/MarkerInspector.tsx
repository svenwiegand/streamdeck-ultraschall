import * as React from "react"
import {actionId, Settings} from "common/actions/marker"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector} from "./ReactActionInspector"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [settings, setSettings] = React.useState(props.settings)
    const onMarkerTypeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const s = {markerType: e.currentTarget.value as Settings["markerType"]}
        setSettings(s)
        props.onSettingsChange(s)
    }
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Marker Type</div>
                <select className="sdpi-item-value" value={settings.markerType} onChange={onMarkerTypeChange}>
                    <option value="chapter">Chapter Mark</option>
                    <option value="edit">Edit Mark</option>
                </select>
            </div>
        </InspectorWithGlobalSettings>
    )
}

export class MarkerInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}