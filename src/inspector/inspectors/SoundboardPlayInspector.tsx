import {actionId, Settings} from "common/actions/soundboard-play"
import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"
import * as React from "react"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"
import {HelperText} from "./components/HelperText"
import {TextField} from "./components/TextField"
import {Heading} from "./components/Heading"
import {Select} from "./components/Select"
import {Checkbox} from "./components/Checkbox"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const [playerIdentification, setPlayerIdentification] =
        React.useState<"title" | "position">(props.settings.playerTitle ? "title" : "position")
    const [playerTitle, setPlayerTitle] = React.useState(props.settings.playerTitle)
    const onTitleChange = handler.onInputChange<string>(title => ({title: title.trim() === "" ? undefined : title}))

    const onPlayerIdentificationChange = handler.onInputChange<"title" | "position">(identification => {
        setPlayerIdentification(identification)
        return {playerTitle: identification === "title" ? playerTitle : undefined}
    })
    const onPlayerTitleChange = handler.onInputChange<string>(title => {
        setPlayerTitle(title)
        return ({playerTitle: playerIdentification ? title : undefined})
    })
    const onPlayerPosChange = handler.onInputChange<string>(input => {
        const player = Number(input)
        return isNaN(player) ? undefined : {playerPos: player}
    })

    const onStartTypeChange = handler.onInputChange<Settings["startType"]>(startType => ({startType}))
    const onStopTypeChange = handler.onInputChange<Settings["stopType"]>(stopType => ({stopType}))

    const onSetChapterMarkChange = handler.onInputChange<boolean>(setChapterMark => ({setChapterMark}))

    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <HelperText>
                If you want to see remaining time when soundboard is playing, leave the title above empty and use the below one.
            </HelperText>
            <TextField
                value={handler.settings.title ?? ""}
                onChange={onTitleChange}
            />

            <Heading>Soundboard Clip</Heading>
            <Select
                value={playerIdentification}
                onChange={onPlayerIdentificationChange}
                options={[
                    ["position", "by position in soundboard"],
                    ["title", "by title"],
                ]}
            />
            {playerIdentification === "title" && (
                <>
                    <HelperText>
                        When a soundboard folder is loaded the plugin will determine the player position based on the exact title.
                    </HelperText>
                    <TextField
                        label="Title"
                        value={handler.settings.playerTitle}
                        onChange={onPlayerTitleChange}
                        required={playerIdentification === "title"}
                    />
                    <HelperText>
                        If you already have a soundboard loaded and want to use the key immediately, specify the player position manually here.
                    </HelperText>
                </>
            )}
            <TextField
                label="Position (1-99)"
                value={handler.settings.playerPos}
                onChange={onPlayerPosChange}
                required={playerIdentification === "position"}
                pattern="[1-9][0-9]?"
            />

            <Heading>Button Action</Heading>
            <Select
                label="When stopped"
                value={handler.settings.startType}
                onChange={onStartTypeChange}
                options={[
                    ["play", "Play"],
                    ["fadeIn", "Fade in"],
                ]}
            />
            <Select
                label="While playing"
                value={handler.settings.stopType}
                onChange={onStopTypeChange}
                options={[
                    ["stop", "Stop"],
                    ["fadeOut", "Fade out"],
                ]}
            />

            <Heading>Chapter Mark</Heading>
            <Checkbox
                label="Chapter Mark"
                checkboxLabel="Set chapter mark on play"
                checked={handler.settings.setChapterMark}
                onChange={onSetChapterMarkChange}
            />
        </InspectorWithGlobalSettings>
    )
}

export class SoundboardPlayerInspector extends ReactActionInspector<Settings> {
    constructor() {
        super(actionId, PropertyInspector)
    }
}