import { Client } from "node-osc"
import * as assert from "assert"
import * as ws from "ws"

console.log(new Date())
process.argv.forEach(arg => console.log(arg))

assert(process.argv[2] === "-port")
const registration = {
    port: parseInt(process.argv[3]),
    uuid: process.argv[5],
    event: process.argv[7],
    info: JSON.parse(process.argv[9])
}
console.log(registration)

const osc = new Client("127.0.0.1", 8000)
const websocket = new ws.WebSocket(`ws://localhost:${registration.port}`)
websocket.onopen = () => {
    const payload = {
        event: registration.event,
        uuid: registration.uuid,
    }
    websocket.send(JSON.stringify(payload))
}
websocket.onmessage = event => {
    const msg = JSON.parse(event.data.toString())
    console.log(msg)
    if (msg.event === "keyUp") {
        osc.send("t/play")
    }
}