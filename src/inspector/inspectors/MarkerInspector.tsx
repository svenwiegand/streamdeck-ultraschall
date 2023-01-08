import * as React from "react"
import {actionId, Settings} from "common/actions/marker"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const onMarkerTypeChange = handler.onInputChange((markerType: Settings["markerType"]) => ({markerType}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Marker Type</div>
                <select className="sdpi-item-value" value={handler.settings.markerType} onChange={onMarkerTypeChange}>
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