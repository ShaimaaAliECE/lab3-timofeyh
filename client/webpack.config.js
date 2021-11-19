const path = require('path');

module.exports = {
    output: {
        path: path.join(__dirname, '/app'),
        filename: 'index.bundle.js',
        publicPath: '/'
    },
    devServer: {
        port: 3000,
        proxy: {
            '/api': {
                 target: 'http://localhost:3000',
                 router: () => 'http://localhost:5000',
                 logLevel: 'debug' /*optional*/
            }
         },
         historyApiFallback: {index: 'index.html'},
         hot: true
    },
    module: {
        rules: [
            {
                test: /\.js$|jsx/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};