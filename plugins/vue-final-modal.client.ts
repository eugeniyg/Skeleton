import vfmPlugin from 'vue-final-modal';

export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore
  nuxtApp.vueApp.use(vfmPlugin);
});
