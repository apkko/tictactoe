'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env,options) => {
    let BUILD_NAME = 'build'+new Date().getTime()+'.js';
    let platform = '';
    if(env.platform)
        platform = env.platform;
    let entry = {
        main: path.resolve(__dirname, './src/main.js'),
    };

    let output = {
        path: path.resolve(__dirname, 'build-'+platform),
        filename: BUILD_NAME,
    };
    /*
    let devServer = {
        open: true,
        static: [
            { directory: 'assets', publicPath: '/assets' },
        ],
    };
    */
    let plugins = [
        new CopyWebpackPlugin({
            patterns:[
                {from: 'assets',to: 'assets'},
                {from: 'css',to: 'css'},
            ],
        }),new HtmlWebpackPlugin({
            template: './templates/index-'+platform+'.ejs',
            cache: false,
            inject:false,
            templateParameters: {
                'build': BUILD_NAME,
          },
        
        })
    ];

    let performance = {
        hints: false,
        maxEntrypointSize: 2 * 1024 ** 2,
        maxAssetSize: 2 * 1024 ** 2,
    };
    return {
        entry,
        output,
        //devServer,
        //module,
        plugins,
        performance,
    };
};
