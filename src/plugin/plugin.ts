import { Client } from "node-osc"

console.log(new Date())
process.argv.forEach(arg => console.log(arg))

const osc = new Client("127.0.0.1", 8000)
osc.send("t/play", () => {
    osc.close()
})