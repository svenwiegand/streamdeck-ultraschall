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
    const onSelectChange = (onChange: (value: string) => Partial<Settings>) => {
        return (e: React.FormEvent<HTMLSelectElement>) => {
            updateSettings(onChange(e.currentTarget.value))
        }
    }
    const onStartTypeChange = onSelectChange(st => ({startType: st as Settings["startType"]}))
    const onStopTypeChange = onSelectChange(st => ({stopType: st as Settings["stopType"]}))
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
            <div className="sdpi-heading"><strong>Button Action</strong></div>
            <div className="sdpi-item">
                <div className="sdpi-item-label">When stopped</div>
                <select className="sdpi-item-value select" value={settings.startType} onChange={onStartTypeChange}>
                    <option value="play">Play</option>
                    <option value="fadeIn">Fade in</option>
                </select>
            </div>
            <div className="sdpi-item">
                <div className="sdpi-item-label">While playing</div>
                <select className="sdpi-item-value select" value={settings.stopType} onChange={onStopTypeChange}>
                    <option value="stop">Stop</option>
                    <option value="fadeOut">Fade out</option>
                </select>
            </div>
        </InspectorWithGlobalSettings>
    )
}

export class SoundboardPlayerInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}