import {OscAction} from "./OscAction"
import {actionId, Settings} from "common/actions/soundboard-duck"
import {Osc} from "../osc/Osc"
import iconDuck from "assets/images/key-soundboard-duck.svg"
import iconDucked from "assets/images/key-soundboard-ducked.svg"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {Message} from "../osc/typedOsc"
import {KeyEvent} from "streamdeck/plugin/events"

type Instance = ActionInstance<Settings, State>

interface State {
    ducked: boolean
}

export class SoundboardDuckAction extends OscAction<Settings, State> {
    constructor(osc: Osc) {
        super(actionId, osc)
    }

    protected deriveState(settings: Settings, instance?: Instance): State {
        return {ducked: false}
    }

    protected instanceImage(settings: Settings): string | undefined {
        return iconDuck
    }

    protected instanceOscSubscribeAddresses(settings: Settings): string[] {
        return ["/ultraschall/soundboard/duck/enabled"]
    }

    onOscMessage(instance: Instance, msg: Message) {
        super.onOscMessage(instance, msg)
        if (msg.address === "/ultraschall/soundboard/duck/enabled") {
            const ducked = msg.args?.[0] as number > 0
            instance.state.ducked = ducked
            instance.setImage(ducked ? iconDucked : iconDuck)
        }
    }

    protected onKeyDown(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)
        const duck = instance.settings.mode === "toggle" ? !instance.state.ducked : true
        this.osc.send("/ultraschall/soundboard/duck/enabled", duck ? 1 : 0)
    }

    protected onKeyUp(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyUp(instance, payload)
        if (instance.settings.mode === "pushToDuck") {
            this.osc.send("/ultraschall/soundboard/duck/enabled", 0)
        }
    }
}