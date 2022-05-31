import lodash from 'lodash';

export default defineNuxtPlugin(() => ({
    provide: {
      _: lodash,
    },
  }));
