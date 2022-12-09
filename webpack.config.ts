// Generated using webpack-cli https://github.com/webpack/webpack-cli
import * as path from "path"
import * as webpack from "webpack"

const isProduction = process.env.NODE_ENV == "production"
const stylesHandler = "style-loader"

const config: webpack.Configuration = {
    entry: "./src/plugin/plugin.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "plugin.js",
    },
    plugins: [
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: "ts-loader",
                exclude: ["/node_modules/"],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,"css-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
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