import { storeToRefs } from 'pinia';

export default defineNuxtRouteMiddleware((from, to) => {
  const layoutStore = useLayoutStore();

  const { isShowAlert } = storeToRefs(layoutStore);

  if (to.path !== from.path && isShowAlert) {
    layoutStore.hideAlert();
  }
});
