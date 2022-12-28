export const actionId = "de.sven-wiegand.ultraschall.marker"
export interface Settings {
    markerType: "chapter" | "edit"
}
export const defaultSettings: Settings = {
    markerType: "chapter"
}