const WorkerPlugin = require("worker-plugin")
const path = require('path');

module.exports = {
  "transpileDependencies": [
    "vuetify",
    "eslint-loader"
  ],
  parallel: false,
  configureWebpack: {
    output: {
      globalObject: "this"
    },
    plugins: [
      new WorkerPlugin()
    ],
    resolve: {
      extensions: ["*", ".mjs", ".js", ".vue", ".json", ".mjs", ".js", ".vue", ".json", ".gql", ".graphql"],
      alias: {
        '@ledgerhq/devices/hid-framing': path.join(__dirname, 'node_modules/@ledgerhq/devices/lib/hid-framing'),
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: require.resolve("@open-wc/webpack-import-meta-loader"),
        },
        {
          test: /\.(c|m)?js$/,
          use: {
            loader: "babel-loader",
            options: {
              compact: false,
              presets: ["@babel/preset-env"]
            }
          }
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ]
    }
  }
}