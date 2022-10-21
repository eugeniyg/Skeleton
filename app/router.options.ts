import type { RouterConfig } from '@nuxt/schema';

// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      return savedPosition;
    }

    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          top: 0,
          left: 0,
          behaviour: 'smooth',
        });
      }, 200);
    });

    const resolve = await promise;

    return resolve;
  },
};
