import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"
import {actionId, Settings} from "common/actions/soundboard-duck"
import * as React from "react"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const onModeChange = handler.onInputChange((mode: Settings["mode"]) => ({mode}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Mode</div>
                <select className="sdpi-item-value select" value={handler.settings.mode} onChange={onModeChange}>
                    <option value="toggle">Toggle</option>
                    <option value="pushToDuck">Push to duck</option>
                </select>
            </div>
        </InspectorWithGlobalSettings>
    )
}

export class SoundboardDuckInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}