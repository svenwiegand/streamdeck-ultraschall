export const actionId = "de.sven-wiegand.ultraschall.soundboard.play"
export interface Settings {
    playerPos: number
    playerTitle?: string
    title?: string
    startType: "play" | "fadeIn"
    stopType: "stop" | "pause" | "fadeOut"
}
