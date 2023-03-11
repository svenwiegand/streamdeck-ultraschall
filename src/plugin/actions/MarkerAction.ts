import {actionId, defaultSettings, Settings} from "common/actions/marker"
import {OscAction} from "./OscAction"
import {Osc} from "../osc/Osc"
import {ActionInstance} from "streamdeck/plugin/PluginAction"
import {AppearanceEvent, KeyEvent} from "streamdeck/plugin/events"
import iconChapterMark from "assets/images/key-marker-chapter.svg"
import iconEditMark from "assets/images/key-marker-edit.svg"

type Instance = ActionInstance<Settings>

export class MarkerAction extends OscAction<Settings> {
    constructor(osc: Osc) {
        super(actionId, osc, defaultSettings)
    }

    protected onWillAppear(instance: Instance, payload: AppearanceEvent<Settings>["payload"]) {
        super.onWillAppear(instance, payload)
        if (!("markerType" in payload.settings)) {
            instance.setSettings(defaultSettings)
        }
    }

    protected instanceTitle(settings: Settings): string | undefined {
        switch (settings.markerType) {
            case "chapter": return "Chapter"
            case "edit": return "Edit Mark"
        }
    }

    protected instanceImage(settings: Settings): string | undefined {
        switch (settings.markerType) {
            case "chapter": return iconChapterMark
            case "edit": return iconEditMark
        }
    }

    protected onKeyDown(instance: Instance, payload: KeyEvent<Settings>["payload"]) {
        super.onKeyDown(instance, payload)
        const setMarker = (markerName: string) => {
            this.osc.send(`/action/_Ultraschall_Set_${markerName}_Play`)
            instance.showOk()
        }
        switch (instance.settings.markerType) {
            case "chapter": return setMarker("Marker")
            case "edit": return setMarker("Edit")
        }
    }
}