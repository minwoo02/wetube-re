const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  watch: true, //계속 지켜보기
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
    clean: true, //webpack이 재시작될 때 기존 assets 파일들 싹 clean하고 다시 만들어주기
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/, //모든 scss들을 긁어온다.
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
