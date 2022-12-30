export const actionId = "de.sven-wiegand.ultraschall.soundboard.play"
export interface Settings {
    player: number
    startType: "play" | "fadeIn"
    stopType: "stop" | "pause" | "fadeOut"
}
