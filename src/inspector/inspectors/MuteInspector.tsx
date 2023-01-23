import * as React from "react"
import {actionId, Settings} from "common/actions/mute"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"
import {Select} from "./components/Select"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const onTrackChange = handler.onInputChange<number>(track => ({track}))
    const onModeChange = handler.onInputChange<Settings["mode"]>(mode => ({mode}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <Select
                label="Track"
                value={handler.settings.track}
                onChange={onTrackChange}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(track => [track, `Track ${track}`])}
            />
            <Select
                label="Mode"
                value={handler.settings.mode}
                onChange={onModeChange}
                options={[
                    ["toggle", "Toggle"],
                    ["pushToMute", "Push to mute"],
                    ["pushToTalk", "Push to talk"],
                ]}
            />
        </InspectorWithGlobalSettings>
    )
}

export class MuteInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}