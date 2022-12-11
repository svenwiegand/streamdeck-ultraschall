import osc from "osc"

export function createUDPPort(config) {
    return new osc.UDPPort(config)
}
/* todo
export function testOsc(console) {
    const port = new osc.UDPPort({
        localAddress: "0.0.0.0",
        localPort: 9050,
        metadata: false,
    })
    port.on("message", (oscMsg, timeTag, info) => {
        console.log(oscMsg)
    })
    port.open()
}
*/