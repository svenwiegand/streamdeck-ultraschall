import {AbstractStreamDeckClient} from "./AbstractStreamDeckClient"
import {PluginReceiveEvent} from "./events/receive"
import * as ws from "ws"

export class Plugin<Settings extends object> extends AbstractStreamDeckClient<PluginReceiveEvent<Settings>> {
    public constructor(port: number, event: string, uuid: string) {
        super(event, uuid, new ws.WebSocket(`ws://localhost:${port}`) as unknown as WebSocket)
    }

    protected onClose() {
        super.onClose()
        process.exit()
    }
}