const langRegExp = '([a-z]{2})'; // just take two letters ('uk', 'en' etc.)

module.exports = {
  extendRoutes(routes, resolve) {
    routes.push(
      {
        path: `/:lang${langRegExp}?`,
        name: 'home',
        component: resolve(__dirname, '../pages/index.vue'),
      },
    );
  },
};
