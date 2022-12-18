import * as path from "path"
import * as webpack from "webpack"
import * as nodeExternals from "webpack-node-externals"
import * as CopyPlugin from "copy-webpack-plugin"

const isProduction = process.env.NODE_ENV == "production"
const outputPath = "dist/de.sven-wiegand.ultraschall.sdPlugin"

const pluginConfig: webpack.Configuration = {
    entry: "./src/plugin/plugin.ts",
    target: "node",
    output: {
        path: path.resolve(__dirname, outputPath),
        filename: "plugin.js",
    },
    externals: [nodeExternals()],
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets", to: "[path][name][ext]" }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                include: [
                    path.join(__dirname, 'src/common/'),
                    path.join(__dirname, 'src/plugin/'),
                    path.join(__dirname, 'src/streamdeck/'),
                ],
                exclude: ["/node_modules/"],
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
        fallback: {
            "fs": false,
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
                include: [
                    path.join(__dirname, 'src/common/'),
                    path.join(__dirname, 'src/inspector/'),
                    path.join(__dirname, 'src/streamdeck/'),
                ],
                exclude: ["/node_modules/"],
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
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