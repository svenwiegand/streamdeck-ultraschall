import * as React from "react"
import {actionId, Settings} from "common/actions/record"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"
import {Checkbox} from "./components/Checkbox"
import {HelperText} from "./components/HelperText"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const onShowTimeChange = handler.onInputChange<boolean>(showTime => ({showTime}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <Checkbox
                label="Display"
                checkboxLabel="Show recording time"
                checked={handler.settings.showTime}
                onChange={onShowTimeChange}
            />
            <HelperText>You need to leave the title empty to make this work.</HelperText>
        </InspectorWithGlobalSettings>
    )
}

export class RecordInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}