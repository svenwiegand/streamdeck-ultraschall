import {actionId, Settings} from "common/actions/soundboard-play"
import {OscAction} from "./OscAction"
import {Osc} from "../osc/Osc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {KeyEvent} from "streamdeck/plugin/events"
import {Message} from "../osc/typedOsc"

interface State {
    playing: boolean
    progress: number
}

type Instance = ActionInstance<Settings, State>

export class SoundboardPlayAction extends OscAction<Settings, State> {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected defaultSettings(): Settings | undefined {
        const usedPlayers = this.mapInstances(i => i.settings.player).filter(player => !!player)
        const maxPlayer = usedPlayers.length > 0 ? Math.max(...usedPlayers) : 0
        const nextPlayer = maxPlayer + 1
        return {player: nextPlayer}
    }

    protected deriveState(settings: Settings, instance?: Instance): State {
        return {
            playing: false,
            progress: 0,
        }
    }

    protected instanceTitle(settings: Settings): string | undefined {
        return settings.player.toString()
    }

    protected instanceImage(settings: Settings): string | undefined {
        return this.image(0, false)
    }

    protected onKeyDown(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)
        if (instance.state.playing) {
            this.osc.send(`/ultraschall/soundboard/player/${instance.settings.player}/stop`, 1)
        } else {
            this.osc.send(`/ultraschall/soundboard/player/${instance.settings.player}/play`, 1)
        }
    }

    protected instanceOscSubscribeAddresses(settings: Settings): string[] {
        return [
            `/ultraschall/soundboard/player/${settings.player}/play`,
            `/ultraschall/soundboard/player/${settings.player}/progress`,
        ]
    }

    onOscMessage(instance: Instance, msg: Message) {
        super.onOscMessage(instance, msg)
        switch (msg.address) {
            case `/ultraschall/soundboard/player/${instance.settings.player}/play`:
                return this.onPlay(instance, msg.args?.[0] as number > 0)
            case `/ultraschall/soundboard/player/${instance.settings.player}/progress`:
                return this.onProgress(instance, msg.args?.[0] as number)
        }
    }

    private onPlay(instance: Instance, playing: boolean) {
        instance.state.playing = playing
    }

    private onProgress(instance: Instance, progress: number) {
        instance.state.progress = progress
        instance.setImage(this.image(progress, instance.state.playing))
    }

    private image(progress: number, isPlaying: boolean) {
        return `data:image/svg+xml;charset=utf8,${renderKey(progress, isPlaying ? iconStop : iconPlay)}`
    }
}

const colorInactive = "#a6a6a6"
const colorActive = "#fff"
const iconPlay = `<polygon 
    points="64,48 88,64 64,80" 
    stroke="${colorInactive}"
    stroke-width="8"
    stroke-linejoin="round"
    fill="${colorInactive}"
/>`
const iconStop = `<polygon 
    points="60,52 84,52 84,76 60,76" 
    stroke="${colorActive}"
    stroke-width="8"
    stroke-linejoin="round"
    fill="${colorActive}"
/>`
const iconPause = `<polygon 
    points="60,52 64,52 64,76 60,76" 
    stroke="${colorActive}"
    stroke-width="8"
    stroke-linejoin="round"
    fill="${colorActive}"
    />
    <polygon 
    points="80,52 84,52 84,76 80,76" 
    stroke="${colorActive}"
    stroke-width="8"
    stroke-linejoin="round"
    fill="${colorActive}"
/>`

const renderKey = (progress: number, innerIcon: string) => {
    const color = "#00a396"
    const strokeWidth = 8
    const r = 36
    const cx = 72
    const cy = 64
    const startX = cx
    const startY = cy - r
    const degree = 360 * progress
    const rotation = 0
    const largeArc = degree > 180 ? 1 : 0
    const sweep = 1
    const radian = degree * Math.PI / 180
    const endX = cx + r * Math.sin(radian)
    const endY = cy + -r * Math.cos(radian)

    return `<svg width="144" height="144" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${cx}" cy="${cy}" r="${r}" stroke="${color}" stroke-width="${strokeWidth}" stroke-opacity="0.4" fill-opacity="0"/>
        <path 
            d="M ${startX} ${startY} A ${r} ${r} ${rotation} ${largeArc} ${sweep} ${endX} ${endY}" 
            stroke="${color}" 
            stroke-width="${strokeWidth}" 
            stroke-linecap="round"
        />
        ${innerIcon}
    </svg>`
}