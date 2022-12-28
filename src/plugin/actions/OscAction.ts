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

export abstract class OscAction<
    Settings extends object = object,
    State extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends PluginAction<Settings, State, GlobalSettings, Payload> {
    protected readonly osc: Osc
    private readonly subscribers = new Map<string, SubscribeContext<Settings>>()

    protected constructor(uuid: string, osc: Osc) {
        super(uuid)
        this.osc = osc
    }

    protected subscribeOsc(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, address: string) {
        let subscriber = this.subscribers.get(instance.context)
        if (!subscriber) {
            subscriber = new SubscribeContext(this, instance)
        }
        this.osc.addListener(address, subscriber.listener)
    }

    protected unsubscribeOsc(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, address: string) {
        const subscriber = this.subscribers.get(instance.context)
        if (subscriber) {
            this.osc.removeListener(address, subscriber.listener)
        }
    }

    public onOscMessage(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, msg: Message) {
        // no default implementation
    }

    /**
     * Returns OSC addresses to automatically subscribe the instance with the provided settings for
     * or an empty array if no automatic subscription is needed.
     *
     * If at least one address is returned `OscAction` will automatically care for subscribing and unsubscribing when
     * the instance is created, destroyed or it's settings are changing.
     */
    protected instanceOscSubscribeAddresses(settings: Settings): string[] {
        return []
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

    protected onWillAppear(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: AppearanceEvent<Settings>["payload"]) {
        super.onWillAppear(instance, payload)

        const title = this.instanceTitle(payload.settings)
        if (title) {
            instance.setTitel(title)
        }

        this.resubscribeOsc(instance, payload.settings)
    }

    protected onDidReceiveSettings(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, settings: Settings, prevSettings: Settings) {
        super.onDidReceiveSettings(instance, settings, prevSettings)

        const title = this.instanceTitle(settings)
        if (title) {
            instance.setTitel(title)
        }

        this.resubscribeOsc(instance, settings, prevSettings)
    }

    protected onWillDisappear(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: AppearanceEvent<Settings>["payload"]) {
        super.onWillDisappear(instance, payload)
        this.resubscribeOsc(instance, undefined, payload.settings)
    }

    private resubscribeOsc(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, settings?: Settings, prevSettings?: Settings) {
        const newAddresses = settings ? this.instanceOscSubscribeAddresses(settings) : []
        const prevAddresses = prevSettings ? this.instanceOscSubscribeAddresses(prevSettings) : []
        if (JSON.stringify(newAddresses) !== JSON.stringify(prevAddresses)) {
            prevAddresses.forEach(address => this.unsubscribeOsc(instance, address))
            newAddresses.forEach(address => this.subscribeOsc(instance, address))
        }
    }
}