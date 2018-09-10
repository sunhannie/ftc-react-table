var webpack = require('webpack');
var path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");  

const HtmlWebpackPlugin = require("html-webpack-plugin"); 

const cleanWebpackPlugin = require("clean-webpack-plugin");

var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var UglifyJsPlugin=require('uglifyjs-webpack-plugin');

module.exports = {
    mode: "development", 
    devtool: 'cheap-module-eval-source-map',
    entry:      
    {
        'index':['./client/index.js','./client/styles/index.scss'], 
        'vendor': ['react', 'react-dom', 'react-router']  
    },
    output: {
        path: path.resolve(__dirname, 'build/'),  
        filename: '[name].js', 
        publicPath: '', 
        chunkFilename: "[chunkhash].js"   
    },
    module: {
        rules:[
             {
                test: /\.js|\.jsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['react','es2015','env'],
                        plugins: [require('babel-plugin-transform-object-rest-spread')]  
                    }
                }
             },
             {
                test: /\.css$/,
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                loader: 'style-loader!css-loader?modules&importLoaders&localIdentName=[name]__[local]__[hash:base64:5]!sass-loader?sourceMap=true&sourceMapContents=true',
 
             },
               
             {
                test: /\.json?$/,
                loader: 'json'
             },
          
             {
                test: /\.html$/,
                use: [
                    "htmllint-loader",
                    {
                        loader: "html-loader",
                        options: {
                        }
                    }
                ]
            },
            {
                test:  /\.scss$/, 
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                // use: [
                //     {  
                //         loader: 'style-loader'   // 将 JS 字符串生成为 style 节点，并自动将css代码放到生成的style标签中插入到head标签里
                //     },
                //     {
                //         loader: 'css-loader',  // 将 CSS 转化成 CommonJS 模块
                //     },
                //     {
                //         loader: 'sass-loader',  // 将 Sass 编译成 CSS
                //         options: { 
                //             sourceMap:true  ,
                //             sourceMapContents:true
                //         }
                //     },
                    
                // ]
                use: ExtractTextPlugin.extract({  //把上面注释的改成下面方式，可以单独打包js文件
                    fallback:"style-loader",
                    use: ["css-loader", "sass-loader"]
                })  
            }
        ]  //end rules    
    },
     resolve: {
        alias: {
            'react': path.join(__dirname,'node_modules','react'),
        },
        extensions: [".js", ".json", ".jsx", ".css", ".scss"],
    },
     performance: {
        hints:  false, // enum
        maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
    },

    plugins: [
        // 调用之前先清除
	//   new cleanWebpackPlugin(["build"]),
      new ExtractTextPlugin('client/styles/index.css'),  // 分离css插件参数为提取出去的路径。 打包后在build（为output 设置的path）中生成 client/styles/index.css文件。

       new HtmlWebpackPlugin({
           template:'./views/index.html',
           filename:'index.html',
           title:'测试',
           chunks:['index'],
           inject: 'body',
       }),
       new webpack.HotModuleReplacementPlugin(),//产生hot-update.js文件
       new OpenBrowserPlugin({ url: 'http://localhost:3000' }),
       new webpack.DefinePlugin({    // 把引入的React切换到产品版本
        'process.env.NODE_ENV': '"production"'
       })
    ],
    // watch: true ,//这意味着在初始构建之后，webpack将继续监视任何已解析文件的更改。手表模式默认关闭
     optimization: {   //js压缩
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: false
                }
            })
        ],

    },

     devServer: {
        host:'localhost',
        port:3001,
        contentBase: path.resolve(__dirname, ''), // 设置服务器访问的基本目录，跟publicPath一样（为什么还得查找）
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload   
    }
};
