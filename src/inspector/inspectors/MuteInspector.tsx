import * as React from "react"
import {actionId, Settings} from "common/actions/mute"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {GlobalSettings} from "common/actions/global"
import {ReactActionInspector} from "./ReactActionInspector"
import {ActionInspector} from "streamdeck/inspector/ActionInspector"

interface Props {
    track?: number
    onTrackChange: (track: number) => void
    inspector: ActionInspector<Settings, GlobalSettings>
}

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [track, setTrack] = React.useState(props.track ?? 1)
    const onTrackChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const newTrack = Number(e.currentTarget.value)
        setTrack(newTrack)
        props.onTrackChange(newTrack)
    }
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Track</div>
                <select className="sdpi-item-value" value={track} onChange={onTrackChange}>
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
        </InspectorWithGlobalSettings>
    )
}

export class MuteInspector extends ReactActionInspector<Props, Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }

    protected props(settings: Settings): Props {
        const onTrackChange = (track: number) => this.setSettings({track})
        return {
            track: settings.track,
            onTrackChange,
            inspector: this
        }
    }
}