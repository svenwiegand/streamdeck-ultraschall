import {actionId, Settings} from "common/actions/soundboard-play"
import {OscAction} from "./OscAction"
import {Osc} from "../osc/Osc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {KeyEvent} from "streamdeck/plugin/events"
import {Message} from "../osc/typedOsc"

interface State {
    state: "playing" | "paused" | "stopped" | "done"
    secondaryState?: "fadingIn" | "fadingOut"
    progress: number
    remainingTime?: string
}

type Instance = ActionInstance<Settings, State>

type Action = "play" | "pause" | "stop" | "fadeIn" | "fadeOut"

export class SoundboardPlayAction extends OscAction<Settings, State> {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected defaultSettings(): Settings | undefined {
        const usedPlayers = this.mapInstances(i => i.settings.player).filter(player => !!player)
        const maxPlayer = usedPlayers.length > 0 ? Math.max(...usedPlayers) : 0
        const nextPlayer = maxPlayer + 1
        return {
            player: nextPlayer,
            startType: "play",
            stopType: "stop",
        }
    }

    protected deriveState(settings: Settings, instance?: Instance): State {
        return {
            state: "stopped",
            progress: 0,
        }
    }

    protected instanceTitle(settings: Settings): string | undefined {
        return settings.title ?? settings.player.toString()
    }

    protected instanceImage(settings: Settings): string | undefined {
        return this.image({state: "stopped", progress: 0}, settings)
    }

    protected onKeyDown(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)

        const sendCommand = (command: "play" | "pause" | "stop" | "fadein" | "fadeout", arg = 1) => {
            this.osc.send(`/ultraschall/soundboard/player/${instance.settings.player}/${command}`, arg)
        }

        switch (this.action(instance.state, instance.settings)) {
            case "play": return sendCommand("play")
            case "pause": return sendCommand("pause")
            case "stop": return sendCommand("stop")
            case "fadeIn": return sendCommand("fadein")
            case "fadeOut": return sendCommand("fadeout")
        }
    }

    protected instanceOscSubscribeAddresses(settings: Settings): string[] {
        return [
            `/ultraschall/soundboard/player/${settings.player}/play`,
            `/ultraschall/soundboard/player/${settings.player}/fadein`,
            `/ultraschall/soundboard/player/${settings.player}/fadeout`,
            `/ultraschall/soundboard/player/${settings.player}/pause`,
            `/ultraschall/soundboard/player/${settings.player}/stop`,
            `/ultraschall/soundboard/player/${settings.player}/done`,
            `/ultraschall/soundboard/player/${settings.player}/progress`,
            `/ultraschall/soundboard/player/${settings.player}/remaining`,
        ]
    }

    private action(state: State, settings: Settings): Action {
        switch (state.state) {
            case "playing": return state.secondaryState ? "stop" : settings.stopType
            case "paused": return "stop" // due to a bug in ultraschall soundboard we cannot resume – just stop
            case "stopped": return settings.startType
            case "done": return settings.startType
        }
    }

    onOscMessage(instance: Instance, msg: Message) {
        super.onOscMessage(instance, msg)

        const onStateMsg = (state: State["state"]) => {
            if (msg.args?.[0] as number > 0) {
                this.updateState(instance, state)
            }
        }

        const onSecondaryStateMsg = (secondaryState: State["secondaryState"]) => {
            this.updateSecondaryState(instance, msg.args?.[0] as number > 0 ? secondaryState : undefined)
        }

        switch (msg.address) {
            case `/ultraschall/soundboard/player/${instance.settings.player}/play`:
                return onStateMsg("playing")
            case `/ultraschall/soundboard/player/${instance.settings.player}/pause`:
                return onStateMsg("paused")
            case `/ultraschall/soundboard/player/${instance.settings.player}/stop`:
                return onStateMsg("stopped")
            case `/ultraschall/soundboard/player/${instance.settings.player}/done`:
                return onStateMsg("done")
            case `/ultraschall/soundboard/player/${instance.settings.player}/fadein`:
                return onSecondaryStateMsg("fadingIn")
            case `/ultraschall/soundboard/player/${instance.settings.player}/fadeout`:
                return onSecondaryStateMsg("fadingOut")
            case `/ultraschall/soundboard/player/${instance.settings.player}/progress`:
                return this.onProgress(instance, msg.args?.[0] as number)
            case `/ultraschall/soundboard/player/${instance.settings.player}/remaining`:
                return this.updateTitle(instance, msg.args?.[0] as string)
        }
    }

    private onProgress(instance: Instance, progress: number) {
        instance.state.progress = progress
        this.updateImage(instance)
    }

    private updateState(instance: Instance, state: State["state"]) {
        instance.state.state = state
        this.updateImage(instance)
        this.updateTitle(instance)
    }

    private updateSecondaryState(instance: Instance, secondaryState: State["secondaryState"]) {
        instance.state.secondaryState = secondaryState
        this.updateImage(instance)
    }

    private updateTitle(instance: Instance, updatedRemainingTime?: string) {
        if (updatedRemainingTime) {
            instance.state.remainingTime = updatedRemainingTime
        }
        switch (instance.state.state) {
            case "playing": break
            default: instance.state.remainingTime = undefined
        }
        instance.setTitle(instance.state.remainingTime ?? instance.settings.title)
    }

    private updateImage(instance: Instance) {
        instance.setImage(this.image(instance.state, instance.settings))
    }

    private image(state: State, settings: Settings) {
        return `data:image/svg+xml;charset=utf8,${renderKey(state.progress, this.action(state, settings))}`
    }
}

const colorInactive = "#a6a6a6"
const colorActive = "#a6a6a6"
const actionIcon = {
    play: `<polygon 
        points="64,48 88,64 64,80" 
        stroke="${colorInactive}"
        stroke-width="8"
        stroke-linejoin="round"
        fill="${colorInactive}"
    />`,
    fadeIn: `<polygon 
        points="60,76 84,52 84,76" 
        stroke="${colorInactive}"
        stroke-width="8"
        stroke-linejoin="round"
        fill="${colorInactive}"
    />`,
    stop: `<polygon 
        points="60,52 84,52 84,76 60,76" 
        stroke="${colorActive}"
        stroke-width="8"
        stroke-linejoin="round"
        fill="${colorActive}"
    />`,
    pause: `<polygon 
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
    />`,
    fadeOut: `<polygon 
        points="60,52 84,76 60,76" 
        stroke="${colorActive}"
        stroke-width="8"
        stroke-linejoin="round"
        fill="${colorActive}"
    />`,
}

const renderKey = (progress: number, action: Action) => {
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
        ${actionIcon[action]}
    </svg>`
}