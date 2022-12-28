export const actionId = "de.sven-wiegand.ultraschall.mute"
export interface Settings {
    track: number
    mode: "toggle" | "pushToMute" | "pushToTalk"
}