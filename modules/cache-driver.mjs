import { defineDriver } from 'unstorage/drivers/utils/index';
import lruCacheDriver from 'unstorage/drivers/lru-cache'

export default defineDriver((opts) => {
  return lruCacheDriver(opts);
});