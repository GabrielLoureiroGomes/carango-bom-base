const { createProxyMiddleware } = require("http-proxy-middleware");
const pino = require("pino-http")();

module.exports = function (app) {
  const apiUrl = process.env.REACT_APP_API_URL;

  app.use(pino);

  app.use(
    "/api",
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
    })
  );
};
