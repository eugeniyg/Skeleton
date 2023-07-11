// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware((to) => {
  const gameStore = useGamesStore();
  if (!to.query.category) {
    return navigateTo({ path: to.path, query: { ...to.query, category: gameStore.currentLocationCollections[0].identity } });
  }

  const hasCategory = gameStore.currentLocationCollections.some((category) => category.identity === to.query.category);
  if (!hasCategory) {
    return navigateTo({ path: to.path, query: { ...to.query, category: gameStore.currentLocationCollections[0].identity } });
  }
});
