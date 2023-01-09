import { Compiler } from "webpack"
import fs from "fs"

interface Options {
    files: string[]
}

class WebpackMakeExecutable {
    private readonly options

    constructor(options: Options) {
        this.options = options
    }

    apply(compiler: Compiler) {
        compiler.hooks.done.tap("WebpackMakeExecutable", () => {
            this.options.files.forEach(path => fs.chmodSync(path, "755"))
        })
    }
}

export default WebpackMakeExecutable