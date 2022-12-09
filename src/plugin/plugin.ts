import { Client } from "node-osc"

console.log("Hello World!")
process.argv.forEach(console.log)
const osc = new Client("127.0.0.1", 8000)
osc.send("t/play", () => {
    osc.close()
})