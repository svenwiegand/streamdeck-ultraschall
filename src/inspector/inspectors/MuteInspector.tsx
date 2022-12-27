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
    const onTrackChange = (e: React.FormEvent<HTMLInputElement>) => {
        const newTrack = Number(e.currentTarget.value)
        setTrack(newTrack)
        props.onTrackChange(newTrack)
    }
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Track (1-9)</div>
                <input type="number" className="sdpi-item-value" value={track} onChange={onTrackChange}/>
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