import {
    AppearanceEvent,
    DeviceDidConnectEvent,
    KeyEvent,
    ReceiveEvent,
    SendEvent,
    TitleParametersDidChangeEvent
} from "./events"
import {AbstractAction} from "../common/Action"

export class ActionInstance<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> {
    readonly action: PluginAction<Settings, GlobalSettings, Payload>
    readonly context: string
    sttngs: Settings

    constructor(action: PluginAction<Settings, GlobalSettings, Payload>, context: string, settings: Settings) {
        this.action = action
        this.context = context
        this.sttngs = settings
    }

    didReceiveSettings(settings: Settings) {
        this.sttngs = settings
    }

    get settings(): Settings {
        return this.sttngs
    }

    setTitel(title: string, state?: number, target?: "software" | "hardware" | "both") {
        this.action.sendEvent({
            event: "setTitle",
            context: this.context,
            payload: {title, state, target}
        })
    }

    setImage(image: string, state?: number, target?: "software" | "hardware" | "both") {
        this.action.sendEvent({
            event: "setImage",
            context: this.context,
            payload: {image, state, target}
        })
    }
}

export abstract class PluginAction<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends AbstractAction<
    ReceiveEvent<Settings, GlobalSettings, Payload>,
    SendEvent<Settings, GlobalSettings, Payload>,
    GlobalSettings
>
{
    private contextInstance = new Map<string, ActionInstance<Settings, GlobalSettings, Payload>>()

    constructor(uuid: string) {
        super(uuid)
    }

    forEachInstance(f: (instance: ActionInstance<Settings, GlobalSettings, Payload>) => void) {
        this.contextInstance.forEach(instance => f(instance))
    }

    instance(context: string): ActionInstance<Settings, GlobalSettings, Payload> | undefined {
        return this.contextInstance.get(context)
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>) {
        const withInstance = (context: string, settings: Settings, f: (instance: ActionInstance<Settings, GlobalSettings, Payload>) => void) => {
            let instance = this.contextInstance.get(context)
            if (!instance) {
                instance = new ActionInstance(this, context, settings)
                this.contextInstance.set(context, instance)
            }
            f(instance)
        }
        const withExistingInstance = (context: string, f: (instance: ActionInstance<Settings, GlobalSettings, Payload>) => void) => {
            const instance = this.contextInstance.get(context)
            if (instance) f(instance)
        }
        switch (event.event) {
            case "didReceiveSettings": return withInstance(event.context, event.payload.settings, instance => {
                const prevSettings = instance.settings
                instance.didReceiveSettings(event.payload.settings)
                this.onDidReceiveSettings(instance, event.payload.settings, prevSettings)
            })
            case "didReceiveGlobalSettings":
                return this.onDidReceiveGlobalSettings(event.payload.settings)
            case "keyDown":
                return withInstance(event.context, event.payload.settings,instance => this.onKeyDown(instance, event.payload))
            case "keyUp":
                return withInstance(event.context, event.payload.settings, instance => this.onKeyUp(instance, event.payload))
            case "willAppear":
                return withInstance(event.context, event.payload.settings, instance => this.onWillAppear(instance, event.payload))
            case "willDisappear":
                return withInstance(event.context, event.payload.settings, instance => this.onWillDisappear(instance, event.payload))
            case "titleParametersDidChange":
                return withInstance(event.context, event.payload.settings, instance => this.onTitleParametersDidChange(instance, event.payload))
            case "deviceDidConnect":
                return this.onDeviceDidConnect(event.device, event.deviceInfo)
            case "deviceDidDisconnect":
                return this.onDeviceDidDisconnect(event.device)
            case "applicationDidLaunch":
                return this.onApplicationDidLaunch(event.payload.application)
            case "applicationDidTerminate":
                return this.onApplicationDidTerminate(event.payload.application)
            case "systemDidWakeUp":
                return this.onSystemDidWakeUp()
            case "propertyInspectorDidAppear":
                return withExistingInstance(event.context, instance => this.onPropertyInspectorDidAppear(instance))
            case "propertyInspectorDidDisappear":
                return withExistingInstance(event.context, instance => this.onPropertyInspectorDidDisappear(instance))
            case "sendToPlugin":
                return withExistingInstance(event.context, instance => this.onSendToPlugin(instance, event.payload))
            case "connected": break
            case "disconnected": break
        }
    }

    protected onDidReceiveGlobalSettings(settings: GlobalSettings) {
        // no default implementation
    }

    protected onDeviceDidConnect(device: string, deviceInfo: DeviceDidConnectEvent["deviceInfo"]) {
        // no default implementation
    }

    protected onDeviceDidDisconnect(device: string) {
        // no default implementation
    }

    protected onApplicationDidLaunch(application: string) {
        // no default implementation
    }

    protected onApplicationDidTerminate(application: string) {
        // no default implementation
    }

    protected onSystemDidWakeUp() {
        // no default implementation
    }

    protected onDidReceiveSettings(instance: ActionInstance<Settings, GlobalSettings, Payload>, settings: Settings, prevSettings: Settings) {
        // no default implementation
    }

    protected onKeyDown(instance: ActionInstance<Settings, GlobalSettings, Payload>, payload: KeyEvent<Settings>["payload"]) {
        // no default implementation
    }

    protected onKeyUp(instance: ActionInstance<Settings, GlobalSettings, Payload>, payload: KeyEvent<Settings>["payload"]) {
        // no default implementation
    }

    protected onWillAppear(instance: ActionInstance<Settings, GlobalSettings, Payload>, payload: AppearanceEvent<Settings>["payload"]) {
        // no default implementation
    }

    protected onWillDisappear(instance: ActionInstance<Settings, GlobalSettings, Payload>, payload: AppearanceEvent<Settings>["payload"]) {
        this.contextInstance.delete(instance.context)
    }

    protected onTitleParametersDidChange(instance: ActionInstance<Settings, GlobalSettings, Payload>, payload: TitleParametersDidChangeEvent<Settings>["payload"]) {
        // no default implementation
    }

    protected onPropertyInspectorDidAppear(instance: ActionInstance<Settings, GlobalSettings, Payload>) {
        // no default implementation
    }

    protected onPropertyInspectorDidDisappear(instance: ActionInstance<Settings, GlobalSettings, Payload>) {
        // no default implementation
    }

    protected onSendToPlugin(instance: ActionInstance<Settings, GlobalSettings, Payload>, payload: Payload) {
        // no default implementation
    }
}

type EventHandler<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> = (
    event: ReceiveEvent<Settings, GlobalSettings, Payload>,
    action: PluginAction<Settings, GlobalSettings, Payload>
) => void

export class SimplePluginAction<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends PluginAction<Settings, GlobalSettings, Payload> {
    private readonly eventHandler: EventHandler<Settings, GlobalSettings, Payload>

    constructor(uuid: string, eventHandler: EventHandler<Settings, GlobalSettings, Payload>) {
        super(uuid)
        this.eventHandler = eventHandler
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>): void {
        this.eventHandler?.(event, this)
    }
}