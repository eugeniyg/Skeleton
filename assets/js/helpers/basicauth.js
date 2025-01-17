const AUTH_USERNAME = 'demo';
const AUTH_PASSWORD = 'perunplay';
const HOST_PATH = 'platform.turbostars.io';

export default defineEventHandler(event => {
  const host = event.req.headers?.host;

  if (host !== HOST_PATH) {
    return;
  }

  let allow = false;
  const base64Credentials = event.req.headers?.authorization?.split(' ')?.[1];

  if (base64Credentials) {
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    allow = username === AUTH_USERNAME && password === AUTH_PASSWORD;
  }

  if (!allow) {
    event.res.statusCode = 401;
    event.res.setHeader('WWW-Authenticate', 'Basic realm="Login"');
    event.res.end('Unauthorized');
  }
});
