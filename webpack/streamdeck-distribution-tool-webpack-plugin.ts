import {Compiler} from "webpack"
import fs from "fs"
import path from "path"
import os from "os"
import {execFile} from "child_process"

interface Options {
    pluginId: string
    distDir: string
    enable?: boolean
}

class StreamdeckDistributionToolPlugin {
    private readonly options: Options

    constructor(options: Options) {
        this.options = options
    }

    apply(compiler: Compiler) {
        compiler.hooks.beforeRun.tap("WebpackStreamdeckPackage", () => {
            const file = path.resolve(this.options.distDir, `${this.options.pluginId}.streamdeckPlugin`)
            if (fs.existsSync(file)) {
                fs.rmSync(file)
            }
        })
        compiler.hooks.done.tap("WebpackStreamdeckPackage", () => {
            if (this.options.enable === undefined || this.options.enable) {
                distributionTool(path.resolve(this.options.distDir, `${this.options.pluginId}.sdPlugin`), this.options.distDir)
            }
        })
    }
}

function distributionTool(pluginDir: string, targetDir: string) {
    const distributionTool = path.resolve(__dirname, "..", "bin", `DistributionTool${os.platform() === "win32" ? ".exe" : ""}`)
    execFile(distributionTool, ["-b", "-i", pluginDir, "-o", targetDir], (error, stdout) => {
        console.log("running DistributionTool ...")
        if (error) throw error
        console.log(stdout)
    })
}

export default StreamdeckDistributionToolPlugin