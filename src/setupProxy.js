/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use('/api', createProxyMiddleware({
    target: 'http://a.tangshui.net',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '', // rewrite path
    },
  }))
  app.use('/testapi', createProxyMiddleware({
    target: 'http://testenjoy.tangshui.net',
    changeOrigin: true,
    pathRewrite: {
      '^/testapi': '', // rewrite path
    },
  }))


  app.use('/bookapi', createProxyMiddleware({
    target: 'http://book.tripcity.cn/',
    changeOrigin: true,
    pathRewrite: {
      '^/bookapi': '', // rewrite path
    },
  }))
}