import 'vue-universal-modal/dist/index.css';
import VueUniversalModal from 'vue-universal-modal';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueUniversalModal, {
    teleportTarget: '#modals',
  });
});
