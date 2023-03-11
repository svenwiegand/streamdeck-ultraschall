import * as path from "path"
import * as webpack from "webpack"
import CopyPlugin from "copy-webpack-plugin"
import MakeExecutablePlugin from "./webpack/make-executable-webpack-plugin"
import { PkgPlugin, target } from "./webpack/pkg-webpack-plugin"
import StreamdeckDistributionToolPlugin from "./webpack/streamdeck-distribution-tool-webpack-plugin"
import nodeExternals from "webpack-node-externals"

const isProduction = process.env.NODE_ENV == "production"
const distDir = path.resolve(__dirname, "dist")
const pluginId = "de.sven-wiegand.ultraschall"
const outputDir = path.resolve(distDir, `${pluginId}.sdPlugin`)
const nodeVersion = "node18"

const pluginConfig: webpack.Configuration = {
    entry: "./src/plugin/plugin.ts",
    target: "node",
    output: {
        path: outputDir,
        filename: "plugin.js",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets", to: "[path][name][ext]" }
            ]
        }),
        new PkgPlugin({
            input: path.resolve(outputDir, "plugin.js"),
            targets: [
                target(nodeVersion, "macos", "arm64"),
                target(nodeVersion, "macos", "x64"),
                target(nodeVersion, "win", "x64"),
            ],
            distDir: outputDir,
            enable: isProduction
        }),
        new MakeExecutablePlugin({
            files: [path.resolve(outputDir, "mac", "streamdeck-ultraschall.sh")],
        }),
        new StreamdeckDistributionToolPlugin({
            pluginId,
            distDir,
            enable: isProduction
        })
    ],
    externals: nodeExternals(),
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
            {
                test: /\.svg$/i,
                type: "asset/inline",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", ".svg", "..."],
        fallback: {
            "fs": false,
        },
        alias: {
            assets: path.resolve(__dirname, "assets/"),
            common: path.resolve(__dirname, "src/common/"),
            streamdeck: path.resolve(__dirname, "src/streamdeck/"),
        },
    },
}

const inspectorConfig: webpack.Configuration = {
    entry: "./src/inspector/inspector.ts",
    target: "web",
    output: {
        library: "connectElgatoStreamDeckSocket",
        libraryExport: "default",
        path: outputDir,
        filename: "inspector.js",
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
        alias: {
            common: path.resolve(__dirname, "src/common/"),
            streamdeck: path.resolve(__dirname, "src/streamdeck/"),
        },
    },
    optimization: {
        splitChunks: {},
    }
}

const configs = [pluginConfig, inspectorConfig]
const adjustConfig = (adjust: (config: webpack.Configuration) => void) => configs.forEach(adjust)
module.exports = () => {
    if (isProduction) {
        adjustConfig(config => {
            config.mode = "production"
        })
    } else {
        adjustConfig(config => {
            config.mode = "development"
            config.devtool = "inline-source-map"
        })
    }
    adjustConfig(config => {
        if (config.plugins) {
            config.plugins.push(new webpack.DefinePlugin({
                __mode__: JSON.stringify(config.mode)
            }))
        }
    })
    return configs
}