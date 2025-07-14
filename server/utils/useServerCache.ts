interface ServerCacheOptions<T> {
  key: string;
  data?: T;
  ttl?: number;
}

type ResponseStatus = 'hit' | 'miss' | 'stored';

interface GetResponseData<T> {
  status: ResponseStatus;
  key: string;
  data: T | null;
}

interface SetResponseData {
  status: ResponseStatus;
  key: string;
  expiresAt: number;
}

export async function getServerCache<T = any>(key: string): Promise<GetResponseData<T>> {
  const config = useRuntimeConfig();

  return await $fetch('/api/cache', {
    method: 'GET',
    headers: {
      'x-internal-secret': config.internalApiSecret,
    },
    query: { key },
  });
}

export async function setServerCache<T = any>({
  key,
  data,
  ttl = 60,
}: ServerCacheOptions<T>): Promise<SetResponseData> {
  const config = useRuntimeConfig();

  return await $fetch<SetResponseData>('/api/cache', {
    method: 'POST',
    headers: {
      'x-internal-secret': config.internalApiSecret,
    },
    body: { key, data, ttl },
  });
}
