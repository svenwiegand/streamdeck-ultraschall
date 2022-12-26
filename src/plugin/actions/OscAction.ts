import {ActionInstance, PluginAction} from "streamdeck/plugin/PluginAction"
import {Osc} from "../osc/Osc"
import {Message} from "../osc/typedOsc"
import {AppearanceEvent} from "streamdeck/plugin/events"

class SubscribeContext<Settings extends object> {
    readonly action: OscAction<Settings>
    readonly instance: ActionInstance<Settings>
    readonly listener = (msg: Message) => this.action.onOscMessage(this.instance, msg)

    constructor(action: OscAction<Settings>, instance: ActionInstance<Settings>) {
        this.action = action
        this.instance = instance
    }
}

export abstract class OscAction<Settings extends object = object> extends PluginAction<Settings> {
    protected readonly osc: Osc
    private readonly subscribers = new Map<string, SubscribeContext<Settings>>()

    protected constructor(uuid: string, osc: Osc) {
        super(uuid)
        this.osc = osc
    }

    protected subscribeOsc(instance: ActionInstance<Settings>, address: string) {
        let subscriber = this.subscribers.get(instance.context)
        if (!subscriber) {
            subscriber = new SubscribeContext(this, instance)
        }
        this.osc.addListener(address, subscriber.listener)
    }

    protected unsubscribeOsc(instance: ActionInstance<Settings>, address: string) {
        const subscriber = this.subscribers.get(instance.context)
        if (subscriber) {
            this.osc.removeListener(address, subscriber.listener)
        }
    }

    public onOscMessage(instance: ActionInstance<Settings>, msg: Message) {
        // no default implementation
    }

    /**
     * Returns OSC address to automatically subscribe the instance with the provided settings for
     * or `undefined` if no automatic subscription is needed.
     *
     * If an address is returned `OscAction` will automatically care for subscribing and unsubscribing when
     * the instance is created, destroyed or it's settings are changing.
     */
    protected instanceOscSubscribeAddress(settings: Settings): string | undefined {
        return undefined
    }

    /**
     * Returns title to automatically show on the instance's key with the provided settings
     * or `undefined` if no automatic subscription is needed.
     *
     * If an address is returned `OscAction` will automatically care for subscribing and unsubscribing when
     * the instance is created, destroyed or it's settings are changing.
     */
    protected instanceTitle(settings: Settings): string | undefined {
        return undefined
    }

    protected onWillAppear(instance: ActionInstance<Settings>, payload: AppearanceEvent<Settings>["payload"]) {
        super.onWillAppear(instance, payload)

        const title = this.instanceTitle(payload.settings)
        if (title) {
            instance.setTitel(title)
        }

        const address = this.instanceOscSubscribeAddress(payload.settings)
        if (address) {
            this.subscribeOsc(instance, address)
        }
    }

    protected onDidReceiveSettings(instance: ActionInstance<Settings>, settings: Settings, prevSettings: Settings) {
        super.onDidReceiveSettings(instance, settings, prevSettings)

        const title = this.instanceTitle(settings)
        if (title) {
            instance.setTitel(title)
        }

        const prevAddress = this.instanceOscSubscribeAddress(prevSettings)
        const newAddress = this.instanceOscSubscribeAddress(settings)
        if (newAddress !== prevAddress) {
            if (prevAddress) {
                this.unsubscribeOsc(instance, prevAddress)
            }
            if (newAddress) {
                this.subscribeOsc(instance, newAddress)
            }
        }
    }

    protected onWillDisappear(instance: ActionInstance<Settings>, payload: AppearanceEvent<Settings>["payload"]) {
        super.onWillDisappear(instance, payload)
        const address = this.instanceOscSubscribeAddress(payload.settings)
        if (address) {
            this.unsubscribeOsc(instance, address)
        }
    }
}