const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //是否打开代码检查
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue/'
    : '/'
})
