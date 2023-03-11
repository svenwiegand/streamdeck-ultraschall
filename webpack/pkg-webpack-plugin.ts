import { Compiler } from "webpack"
import { exec } from "pkg"
import fs from "fs"
import path from "path"

export interface Target {
    node: "node10" | "node12" | "node14" | "node16" | "node18" | "latest"
    platform: "alpine" | "linux" | "linuxstatic" | "win" | "macos"
    arch: "x64" | "arm64"
}

export const target = (node: Target["node"], platform: Target["platform"], arch: Target["arch"]) => ({node, platform, arch})

const targetString = (target: Target) => `${target.node}-${target.platform}-${target.arch}`
const targetFileName = (inputFile: string, target: Target) => {
    const baseName = path.basename(inputFile, path.extname(inputFile))
    return `${baseName}-${target.platform}-${target.arch}${target.platform === "win" ? ".exe" : ""}`
}

export interface Options {
    input: string
    targets: Target[]
    distDir: string
    enable?: boolean
}

export class PkgPlugin {
    private readonly options

    constructor(options: Options) {
        this.options = options
    }

    apply(compiler: Compiler) {
        compiler.hooks.beforeRun.tap("WebpackPkg", () => {
            this.options.targets.forEach(target => {
                const file = path.resolve(this.options.distDir, targetFileName(this.options.input, target))
                if (fs.existsSync(file)) {
                    console.log(`deleting ${file}`)
                    fs.rmSync(file)
                }
            })
        })
        compiler.hooks.done.tapAsync("WebpackPkg", async (params, callback) => {
            if (this.options.enable === undefined || this.options.enable) {
                await exec([
                    this.options.input,
                    "--target", this.options.targets.map(targetString).join(","),
                    "--out-path", this.options.distDir
                ])
            }
            callback()
        })
    }
}