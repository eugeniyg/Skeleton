export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const reqSecret = getHeader(event, 'x-internal-secret');
  const hasAccess = reqSecret === config.internalApiSecret;

  if (!hasAccess) {
    throw createError({ statusCode: 403, message: 'Forbidden: Server-only access' });
  }

  const { key, data, ttl = 60 } = await readBody(event);
  if (!key) {
    throw createError({ statusCode: 400, message: 'Missing `key` parameter' });
  }

  const storage = useStorage('memory');
  const dateNow = Date.now();
  const expiresAt = dateNow + Number(ttl) * 1000;
  await storage.setItem(key, { value: data, expiresAt });
  return { status: 'stored', key, expiresAt };
});
