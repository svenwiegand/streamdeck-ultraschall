// Generated using webpack-cli https://github.com/webpack/webpack-cli
import * as path from "path"
import * as webpack from "webpack"
import * as nodeExternals from "webpack-node-externals"
import * as CopyPlugin from "copy-webpack-plugin"

const isProduction = process.env.NODE_ENV == "production"

const pluginConfig: webpack.Configuration = {
    entry: "./src/plugin/plugin.ts",
    devtool: "inline-source-map",
    target: "node",
    output: {
        path: path.resolve(__dirname, "dist/com.sven-wiegand.ultraschall.sdPlugin"),
        filename: "plugin.js",
    },
    externals: [nodeExternals()], // required as build fails otherwise as soon as we use node-osc
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
                include: [path.join(__dirname, 'src/plugin/'), path.join(__dirname, 'src/common/')],
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
    devtool: "inline-source-map",
    target: "web",
    output: {
        library: "connectElgatoStreamDeckSocket",
        libraryExport: "default",
        path: path.resolve(__dirname, "dist/com.sven-wiegand.ultraschall.sdPlugin/js"),
        filename: "inspector.js",
    },
    plugins: [],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                include: [path.join(__dirname, 'src/inspector/'), path.join(__dirname, 'src/common/')],
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

module.exports = () => {
    if (isProduction) {
        pluginConfig.mode = "production"
        inspectorConfig.mode = "production"
    } else {
        pluginConfig.mode = "development"
        inspectorConfig.mode = "development"
    }
    return [pluginConfig, inspectorConfig]
}