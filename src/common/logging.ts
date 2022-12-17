export function initLogging() {
    console.log(`Mode: ${__mode__}`)
    if (__mode__ === "production") {
        console.debug = () => void {}
    }
}