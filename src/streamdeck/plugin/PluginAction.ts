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
    State extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> {
    readonly action: PluginAction<Settings, State, GlobalSettings, Payload>
    readonly context: string
    _settings: Settings
    state?: State

    constructor(action: PluginAction<Settings, State, GlobalSettings, Payload>, context: string, settings: Settings, state: State) {
        this.action = action
        this.context = context
        this._settings = settings
        this.state = state
    }

    didReceiveSettings(settings: Settings) {
        this._settings = settings
    }

    get settings(): Settings {
        return this._settings
    }

    setSettings(settings: Settings) {
        this.action.sendEvent({
            event: "setSettings",
            context: this.context,
            payload: settings,
        })
        this._settings = settings
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

    showAlert() {
        this.action.sendEvent({
            event: "showAlert",
            context: this.context,
        })
    }

    showOk() {
        this.action.sendEvent({
            event: "showOk",
            context: this.context,
        })
    }

    setState(state: number) {
        this.action.sendEvent({
            event: "setState",
            context: this.context,
            payload: {state}
        })
    }

    switchToProfile(device: string, profile: string) {
        this.action.sendEvent({
            event: "switchToProfile",
            context: this.context,
            device,
            payload: {profile}
        })
    }

    sendToPropertyInspector(payload: Payload) {
        this.action.sendEvent({
            event: "sendToPropertyInspector",
            context: this.context,
            action: this.action.uuid,
            payload
        })
    }
}

export abstract class PluginAction<
    Settings extends object = object,
    State extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends AbstractAction<
    ReceiveEvent<Settings, GlobalSettings, Payload>,
    SendEvent<Settings, GlobalSettings, Payload>,
    GlobalSettings
>
{
    private readonly _defaultSettings?: Settings
    private readonly contextInstance = new Map<string, ActionInstance<Settings, State, GlobalSettings, Payload>>()

    constructor(uuid: string, defaultSettings?: Settings) {
        super(uuid)
        this._defaultSettings = defaultSettings
    }

    forEachInstance(f: (instance: ActionInstance<Settings, State, GlobalSettings, Payload>) => void) {
        this.contextInstance.forEach(instance => f(instance))
    }

    mapInstances<R>(f: (instance: ActionInstance<Settings, State, GlobalSettings, Payload>) => R): R[] {
        return Array.from(this.contextInstance.values()).map(f)
    }

    instance(context: string): ActionInstance<Settings, State, GlobalSettings, Payload> | undefined {
        return this.contextInstance.get(context)
    }

    protected defaultSettings(): Settings | undefined {
        return this._defaultSettings
    }

    protected deriveState(settings: Settings, instance?: ActionInstance<Settings, State, GlobalSettings, Payload>): State | undefined {
        return undefined
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>): void {
        const withInstance = (context: string, settings: Settings, f: (instance: ActionInstance<Settings, State, GlobalSettings, Payload>) => void) => {
            let instance = this.contextInstance.get(context)
            if (!instance) {
                instance = new ActionInstance(this, context, settings, this.deriveState(settings) ?? {} as State)
                this.contextInstance.set(context, instance)
            }
            f(instance)
        }
        const withExistingInstance = (context: string, f: (instance: ActionInstance<Settings, State, GlobalSettings, Payload>) => void) => {
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

    protected onDidReceiveSettings(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, settings: Settings, prevSettings: Settings) {
        const state = this.deriveState(settings, instance)
    }

    protected onKeyDown(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: KeyEvent<Settings>["payload"]) {
        // no default implementation
    }

    protected onKeyUp(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: KeyEvent<Settings>["payload"]) {
        // no default implementation
    }

    protected onWillAppear(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: AppearanceEvent<Settings>["payload"]) {
        if (Object.keys(payload.settings).length === 0) {
            const s = this.defaultSettings()
            if (s) {
                instance.setSettings(s)
                this.onDidReceiveSettings(instance, s, payload.settings)
            }
        }
    }

    protected onWillDisappear(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: AppearanceEvent<Settings>["payload"]) {
        this.contextInstance.delete(instance.context)
    }

    protected onTitleParametersDidChange(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: TitleParametersDidChangeEvent<Settings>["payload"]) {
        // no default implementation
    }

    protected onPropertyInspectorDidAppear(instance: ActionInstance<Settings, State, GlobalSettings, Payload>) {
        // no default implementation
    }

    protected onPropertyInspectorDidDisappear(instance: ActionInstance<Settings, State, GlobalSettings, Payload>) {
        // no default implementation
    }

    protected onSendToPlugin(instance: ActionInstance<Settings, State, GlobalSettings, Payload>, payload: Payload) {
        // no default implementation
    }
}