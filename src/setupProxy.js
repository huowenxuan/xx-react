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
}