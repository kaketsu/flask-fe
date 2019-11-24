const {resolve} = require('path');

module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 8888,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: false,
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src/views'));
    // 当需要 npm link 组件库时候可以开启 参考 https://www.jianshu.com/p/ca252cd667df
    // config.resolve.symlinks(false);
  },
}