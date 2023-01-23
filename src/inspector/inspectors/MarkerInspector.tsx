import * as React from "react"
import {actionId, Settings} from "common/actions/marker"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"
import {Select} from "./components/Select"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const onMarkerTypeChange = handler.onInputChange<Settings["markerType"]>(markerType => ({markerType}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <Select
                label="Marker Type"
                value={handler.settings.markerType}
                onChange={onMarkerTypeChange}
                options={[
                    ["chapter", "Chapter Mark"],
                    ["edit", "Edit Mark"],
                ]}
            />
        </InspectorWithGlobalSettings>
    )
}

export class MarkerInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}