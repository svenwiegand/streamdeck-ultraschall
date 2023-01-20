import {actionId, Settings} from "common/actions/soundboard-play"
import {InspectorProps, ReactActionInspector, SettingsHandler} from "./ReactActionInspector"
import * as React from "react"
import {InspectorWithGlobalSettings} from "./InspectorWithGlobalSettings"

type Props = InspectorProps<Settings>

const PropertyInspector: React.FC<Props> = (props: Props) => {
    const handler = new SettingsHandler(props)
    const [playerIdentification, setPlayerIdentification] =
        React.useState<"title" | "position">(props.settings.playerTitle ? "title" : "position")
    const [playerTitle, setPlayerTitle] = React.useState(props.settings.playerTitle)
    const onTitleChange = handler.onInputChange(title => ({title: title.trim() === "" ? undefined : title}))
    const onPlayerIdentificationChange = handler.onInputChange<"title" | "position">(identification => {
        setPlayerIdentification(identification)
        return {playerTitle: identification === "title" ? playerTitle : undefined}
    })
    const onPlayerTitleChange = handler.onInputChange(title => {
        setPlayerTitle(title)
        return ({playerTitle: playerIdentification ? title : undefined})
    })
    const onPlayerPosChange = handler.onInputChange(input => {
        const player = Number(input)
        return isNaN(player) ? undefined : {playerPos: player}
    })
    const onStartTypeChange = handler.onInputChange(st => ({startType: st as Settings["startType"]}))
    const onStopTypeChange = handler.onInputChange(st => ({stopType: st as Settings["stopType"]}))
    return (
        <InspectorWithGlobalSettings inspector={props.inspector}>
            <div className="sdpi-item">
                <div className="sdpi-item-label empty"/>
                <details className="sdpi-item-value">
                    <summary>If you want to see remaining time when soundboard is playing, leave the title above empty and use the below one.</summary>
                </details>
            </div>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Title</div>
                <input
                    className="sdpi-item-value"
                    type="text"
                    value={handler.settings.title ?? ""}
                    onChange={onTitleChange}
                />
            </div>

            <div className="sdpi-heading"><strong>Player (aka Clip)</strong></div>
            <div className="sdpi-item">
                <div className="sdpi-item-label">Identification</div>
                <select className="sdpi-item-value select" value={playerIdentification} onChange={onPlayerIdentificationChange}>
                    <option value="position">by position in soundboard</option>
                    <option value="title">by title</option>
                </select>
            </div>
            {playerIdentification === "title" && (
                <>
                    <div className="sdpi-item">
                        <div className="sdpi-item-label empty"/>
                        <details className="sdpi-item-value">
                            <summary>When a soundboard folder is loaded the plugin will determine the player position based on the exact title.</summary>
                        </details>
                    </div>
                    <div className="sdpi-item">
                        <div className="sdpi-item-label">Title</div>
                        <input
                            className="sdpi-item-value"
                            type="text"
                            value={handler.settings.playerTitle}
                            onChange={onPlayerTitleChange}
                            required={playerIdentification === "title"}
                        />
                    </div>
                    <div className="sdpi-item">
                        <div className="sdpi-item-label empty"/>
                        <details className="sdpi-item-value">
                            <summary>
                                If you already have a soundboard loaded and want to use the key immediately, specify the player position manually here.
                            </summary>
                        </details>
                    </div>
                </>
            )}
            <div className="sdpi-item">
                <div className="sdpi-item-label">Position (1-99)</div>
                <input
                    className="sdpi-item-value"
                    type="text"
                    value={handler.settings.playerPos}
                    onChange={onPlayerPosChange}
                    required={playerIdentification === "position"}
                    pattern="[1-9][0-9]?"
                />
            </div>

            <div className="sdpi-heading"><strong>Button Action</strong></div>
            <div className="sdpi-item">
                <div className="sdpi-item-label">When stopped</div>
                <select className="sdpi-item-value select" value={handler.settings.startType} onChange={onStartTypeChange}>
                    <option value="play">Play</option>
                    <option value="fadeIn">Fade in</option>
                </select>
            </div>
            <div className="sdpi-item">
                <div className="sdpi-item-label">While playing</div>
                <select className="sdpi-item-value select" value={handler.settings.stopType} onChange={onStopTypeChange}>
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