export interface GlobalSettings {
    hostIp: string
    sendPort: number
    receivePort: number
}

export const globalSettingsDefault: GlobalSettings = {
    hostIp: "127.0.0.1",
    sendPort: 8050,
    receivePort: 9050,
}