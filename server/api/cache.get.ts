export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const reqSecret = getHeader(event, 'x-internal-secret');
  const hasAccess = reqSecret === config.internalApiSecret;

  if (!hasAccess) {
    throw createError({ statusCode: 403, message: 'Forbidden: Server-only access' });
  }

  const requestQuery = getQuery(event);
  const key = requestQuery.key as string;
  if (!key) throw createError({ statusCode: 400, message: 'Missing `key` parameter' });

  const storage = useStorage('memory');
  const dateNow = Date.now();
  const cachedData = <{ value: any; expiresAt: number } | null>await storage.getItem(key);
  const isValid = cachedData && typeof cachedData === 'object' && cachedData.expiresAt > dateNow;

  return { status: isValid ? 'hit' : 'miss', key, data: isValid ? cachedData.value : null };
});
