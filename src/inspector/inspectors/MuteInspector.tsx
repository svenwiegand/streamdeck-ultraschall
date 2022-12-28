import * as React from "react"
import {actionId, Settings} from "common/actions/mute"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector} from "./ReactActionInspector"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [settings, setSettings] = React.useState(props.settings)
    const updateSettings = (s: Settings) => {
        setSettings(s)
        props.onSettingsChange(s)
    }
    const onTrackChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const track = Number(e.currentTarget.value)
        updateSettings({...settings, track})
    }
    const onModeChange = (e: React.FormEvent<HTMLSelectElement>) => {
        updateSettings({...settings, mode: e.currentTarget.value as Settings["mode"]})
    }
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Track</div>
                <select className="sdpi-item-value" value={settings.track} onChange={onTrackChange}>
                    <option value="1">Track 1</option>
                    <option value="2">Track 2</option>
                    <option value="3">Track 3</option>
                    <option value="4">Track 4</option>
                    <option value="5">Track 5</option>
                    <option value="6">Track 6</option>
                    <option value="7">Track 7</option>
                    <option value="8">Track 8</option>
                    <option value="9">Track 9</option>
                    <option value="10">Track 10</option>
                </select>
            </div>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Mode</div>
                <select className="sdpi-item-value" value={settings.mode} onChange={onModeChange}>
                    <option value="toggle">Toggle</option>
                    <option value="pushToMute">Push to mute</option>
                    <option value="pushToTalk">Push to talk</option>
                </select>
            </div>
        </InspectorWithGlobalSettings>
    )
}

export class MuteInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}