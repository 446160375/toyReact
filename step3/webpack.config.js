// const path = require("path");

module.exports = {
    entry: "./main.js",
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-react-jsx",
                                { pragma: "ToyReact.createElement" },
                            ],
                        ],
                    },
                },
            },
        ],
    },
    mode: "development",
    optimization: {
        minimize: false,
    },
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        // compress:true,
        hot: true,
        port: "8097",
        inline: true,
        open: true,
        overlay: true,
        proxy: {
            "/api": {
                target: "",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "",
                },
            },
        },
    },
};