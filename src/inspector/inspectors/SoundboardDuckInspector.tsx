import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"
import {actionId, Settings} from "common/actions/soundboard-duck"
import * as React from "react"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {Select} from "./components/Select"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const onModeChange = handler.onInputChange<Settings["mode"]>(mode => ({mode}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <Select
                value={handler.settings.mode}
                onChange={onModeChange}
                options={[
                    ["toggle", "Toggle"],
                    ["pushToDuck", "Push to duck"],
                ]}
            />
        </InspectorWithGlobalSettings>
    )
}

export class SoundboardDuckInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}