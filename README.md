# toyReact
A simple toy react

### 创建gitignore文件
创建git项目的时候忘记创建gitignore文件了，然后会有很多本地的idea配置上传到云上

为了避免需要创建一个gitignore文件
```
在项目的文件目录下右键Git Bush Here
输入touch .gitignore

如果之前已经上传了文件如何删除 git rm -r --cached .idea

.gitignore 文件可添加以下忽略内容
dist/
dist/*
node_modules/
package-lock.json
.vscode

```

### 项目启动
```
先进入step1 或 step2 或 step3
npm install
npm run dev
```

### 项目概括
按照老师视频的流程 每个文件夹 是每节课程的代码

### 组件化——环境搭建
***
### 初始化项目
创建一个文件夹，并使用 npm init 命令初始化一个 package.json 文件。
### 安装依赖环境
--save-dev 表示将这些依赖安装到项目中，并且这些依赖是在开发和测试环境中使用。
```
npm install @babel/core --save-dev
npm install @babel/plugin-transform-react-jsx --save-dev
npm install @babel/preset-env --save-dev
npm install babel-loader --save-dev
npm install webpack --save-dev
npm install webpack-cli --save-dev
npm install webpack-dev-server --save-dev
```

### 配置 webpack 入口文件
将以下代码添加到新增的 webpack.config.js 文件中。
```
module.exports = {
    entry: "./index.js",
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
```
按照这样，我们就可以在代码中使用 JSX 语法了。 运行命令 npx webpack-dev-server / npx webpack
