import * as path from "path"
import * as webpack from "webpack"
import CopyPlugin from "copy-webpack-plugin"
import nodeExternals from "webpack-node-externals"

const isProduction = process.env.NODE_ENV == "production"
const outputPath = "dist/de.sven-wiegand.ultraschall.sdPlugin"

const pluginConfig: webpack.Configuration = {
    entry: "./src/plugin/plugin.ts",
    target: "node",
    output: {
        path: path.resolve(__dirname, outputPath),
        filename: "plugin.js",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets", to: "[path][name][ext]" }
            ]
        })
    ],
    externals: isProduction ? [] : [nodeExternals()],
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
        path: path.resolve(__dirname, outputPath),
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