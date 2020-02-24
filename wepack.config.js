module.exports = {
    mode: 'production', // development|production
    entry: '', // 入口配置
    output: {}, // 输出配置
    module: {
        rules: [{
            test: /\.vue$/,
            use: [{
                    loader: 'vue-loader',
                    options: {

                    }
                },
                {
                    loader: 'iview-loader',
                    options: {
                        prefix: false
                    }
                }
            ]
        }]
    }, // 放置loader加载器，webpack本身只能打包commonjs规范的js文件，用于处理其他文件或语法
    plugins: [], // 插件，扩展功能
    // 以下内容进阶篇再涉及
    resolve: {}, // 为引入的模块起别名
    devServer: {
        overlay: {
            warnings: false,
            errors: false
        },
        lintOnSave: false
    } // webpack-dev-server
}