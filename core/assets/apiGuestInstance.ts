import queryString from 'query-string';

const ROUTES_MAP = {
  '/api/player': process.env.PLAYER_SERVICE_BASE_URL,
  '/api/settings': process.env.SETTINGS_SERVICE_BASE_URL,
  '/api/notification': process.env.NOTIFICATION_SERVICE_BASE_URL,
  '/api/payment': process.env.PAYMENT_SERVICE_BASE_URL,
  '/api/game': process.env.GAME_SERVICE_BASE_URL,
  '/api/retention': process.env.RETENTION_SERVICE_BASE_URL,
  '/api/segment': process.env.SEGMENT_SERVICE_BASE_URL,
  '/api/wallet': process.env.WALLET_SERVICE_BASE_URL,
  '/api/shop': process.env.SHOP_SERVICE_BASE_URL,
}

const API_BASE_URL = process.env.API_BASE_URL;

const getApiUrl = (url:string) => {
  if(!process.server) {
    return url;
  }

  // example: /api/player/something -> http://player-service/api/public/something
  for (const [key, value] of Object.entries(ROUTES_MAP)) {
    if (value && url.startsWith(key)) {
      return url.replace(key, value + '/api/public');
    }
  }

  if(!API_BASE_URL) {
    return url;
  }

  return API_BASE_URL + url;
};

export const useApiGuestInstance = async (url:string, options?:any):Promise<any> => {
  let newUrl = url;

  if (options?.params) {
    const stringifyParams = queryString.stringify(options.params, { arrayFormat: 'bracket' });
    newUrl = `${url}?${stringifyParams}`;
  }

  const newOptions = {
    ...options,
    params: undefined,
    credentials: 'omit',
    retry: 0
  };

  return await $fetch(getApiUrl(newUrl), newOptions);
}
