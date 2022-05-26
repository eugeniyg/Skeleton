import type { RouterConfig } from '@nuxt/schema';

// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (to.path === from.path) {
      return savedPosition;
    }

    return {
      top: 0,
      left: 0,
    };
  },
};
