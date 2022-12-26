import * as React from "react"
import {StreamdeckClient} from "streamdeck/common/StreamdeckClient"
import {SendEvent} from "streamdeck/inspector/events"
import {actionId, Settings} from "common/actions/mute"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {GlobalSettings} from "common/actions/global"
import {ReactActionInspector} from "./ReactActionInspector"

interface Props {
    track?: number
    onTrackChange: (track: number) => void
    client: StreamdeckClient<SendEvent<Settings, GlobalSettings>, GlobalSettings>
}

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const [track, setTrack] = React.useState(props.track ?? 1)
    const onTrackChange = (e: React.FormEvent<HTMLInputElement>) => {
        const newTrack = Number(e.currentTarget.value)
        setTrack(newTrack)
        props.onTrackChange(newTrack)
    }
    return (
        <InspectorWithGlobalSettings client={props.client}>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Track (1-99)</div>
                <input type="number" className="sdpi-item-value" value={track} onChange={onTrackChange}/>
            </div>
        </InspectorWithGlobalSettings>
    )
}

const props = (settings: Settings, client: StreamdeckClient<SendEvent<Settings, GlobalSettings>, GlobalSettings>) => {
    const onTrackChange = (track: number) => {
        client.sendEvent({
            event: "setSettings",
            context: client.uuid,
            payload: {track},
        })
    }
    return {
        track: settings.track,
        onTrackChange,
        client,
    } as Props
}

export const muteInspector = new ReactActionInspector(actionId, PropertyInspector, props)