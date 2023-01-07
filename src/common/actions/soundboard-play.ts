export const actionId = "de.sven-wiegand.ultraschall.soundboard.play"
export interface Settings {
    player: number
    title?: string
    startType: "play" | "fadeIn"
    stopType: "stop" | "pause" | "fadeOut"
}
