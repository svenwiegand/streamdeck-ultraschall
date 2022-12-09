// Generated using webpack-cli https://github.com/webpack/webpack-cli
import * as path from "path"
import * as webpack from "webpack"
import * as nodeExternals from "webpack-node-externals"
import * as CopyPlugin from "copy-webpack-plugin"

const isProduction = process.env.NODE_ENV == "production"
const stylesHandler = "style-loader"

const config: webpack.Configuration = {
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

module.exports = () => {
    if (isProduction) {
        config.mode = "production"
    } else {
        config.mode = "development"
    }
    return config
}