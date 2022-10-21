import { defineEventHandler, createError } from 'h3';
import { createProxyMiddleware } from 'http-proxy-middleware';

let proxy;

if (process.env.NODE_ENV === 'development') {
  proxy = createProxyMiddleware({
    target: process.env.API_BASE_URL,
    changeOrigin: true,
  });
}

export default defineEventHandler(async (event) => {
  if (!proxy) {
    throw createError({ statusCode: 404 });
  }

  await new Promise((resolve, reject) => {
    proxy(event.req, event.res, (err?: unknown) => {
      err ? reject(err) : resolve(true);
    });
  });
});
