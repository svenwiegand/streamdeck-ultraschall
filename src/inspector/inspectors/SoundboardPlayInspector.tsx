import {actionId, Settings} from "common/actions/soundboard-play"
import {InspectorProps, ReactActionInspector} from "./ReactActionInspector"
import * as React from "react"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [settings, setSettings] = React.useState(props.settings)
    const updateSettings = (s: Partial<Settings>) => {
        const newSettings = {...settings, ...s}
        setSettings(newSettings)
        props.onSettingsChange(newSettings)
    }
    const onPlayerChange = (e: React.FormEvent<HTMLInputElement>) => {
        const player = Number(e.currentTarget.value)
        if (!isNaN(player)) {
            updateSettings({player})
        }
    }
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Player (1-99)</div>
                <input
                    className="sdpi-item-value"
                    type="text"
                    value={settings.player}
                    onChange={onPlayerChange}
                    required
                    pattern="[1-9][0-9]?"
                />
            </div>
        </InspectorWithGlobalSettings>
    )
}

export class SoundboardPlayerInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}