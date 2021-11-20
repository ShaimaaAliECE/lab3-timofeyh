const path = require('path');

module.exports = {
    output: {
        path: path.join(__dirname, '/app'),
        filename: 'index.bundle.js',
        publicPath: '/'
    },
    devServer: {
        port: 3001,
        proxy: {
            '/api': {
                 target: 'http://localhost:3001',
                 router: () => 'http://localhost:80',
            }
         },
         historyApiFallback: {index: '/'},
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