import {AbstractAction} from "../common/Action"
import {ReceiveEvent, SendEvent} from "./events"

export abstract class ActionInspector<
    Settings extends object = object,
    GlobalSettings extends object = object,
    Payload extends object = object
> extends AbstractAction<
    ReceiveEvent<Settings, GlobalSettings, Payload>,
    SendEvent<Settings, GlobalSettings, Payload>,
    GlobalSettings
> {
    abstract render(settings: Settings): void

    setSettings(settings: Settings) {
        if (this.client) {
            this.sendEvent({
                event: "setSettings",
                context: this.client.uuid,
                payload: settings,
            })
        }
    }

    setGlobalSettings(settings: GlobalSettings) {
        this.client?.setGlobalSettings(settings)
    }

    getGlobalSettings(): Promise<GlobalSettings> {
        if (this.client)
            return this.client?.getGlobalSettings()
        else
            return Promise.reject("Client not set")
    }

    sendToPlugin(payload: Payload) {
        if (this.client) {
            this.sendEvent({
                event: "sendToPlugin",
                context: this.client.uuid,
                action: this.uuid,
                payload,
            })
        }
    }

    protected onEvent(event: ReceiveEvent<Settings, GlobalSettings, Payload>) {
        switch (event.event) {
            case "didReceiveSettings":
                return this.onDidReceiveSettings(event.payload.settings)
            case "didReceiveGlobalSettings":
                return this.onDidReceiveGlobalSettings(event.payload.settings)
            case "sendToPropertyInspector":
                return this.onSendToPropertyInspector(event.payload)
            case "connected": break
            case "disconnected": break
        }
    }

    protected onDidReceiveSettings(settings: Settings) {
        // no default implementation
    }

    protected onDidReceiveGlobalSettings(settings: GlobalSettings) {
        // no default implementation
    }

    protected onSendToPropertyInspector(payload: Payload) {
        // no default implementation
    }
}