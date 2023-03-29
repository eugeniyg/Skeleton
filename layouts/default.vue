<template>
  <div :class="layoutClasses">
    <atomic-preloader/>

    <layout-header
      @logout="logout"
    />

    <layout-drawer
      @toggle-open="toggleOpen"
    />

    <main class="app-main" :class="{'is-overflow': isHomePage()}">
      <slot />
    </main>

    <layout-footer />

    <atomic-opacity-layer />

    <transition name="fade" mode="out-in">
      <nav-mob v-if="!$route.name?.includes('games-id')" />
    </transition>

    <transition name="fade-down">
      <layout-cookies v-if="showCookiesMessage" />
    </transition>

    <modal-register />
    <modal-register-cancel />
    <modal-sign-in />
    <modal-forgot-pass />
    <modal-reset-pass />
    <modal-deposit />
    <modal-withdraw />
    <modal-success />
    <modal-error />
    <modal-confirm />
    <modal-confirm-bonus/>
    <modal-deposit-limit/>
    <modal-edit-limit/>
    <modal-edit-limit-confirm/>

    <atomic-alert
      :isShow="isShowAlert"
      v-bind="alertProps"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isHomePage, localizePath } = useProjectMethods();

  const {
    isShowAlert, alertProps, showCookiePopup, isDrawerCompact,
  } = storeToRefs(layoutStore);
  const { checkModals } = layoutStore;
  checkModals();

  const { logOutUser } = profileStore;

  function logout():void {
    logOutUser();
  }

  function toggleOpen():void {
    layoutStore.toggleDrawer();
  }

  const route = useRoute();
  const showCookiesMessage = computed(() => showCookiePopup.value
    && route.name !== 'games-id'
    && route.name !== 'locale-games-id'
    && route.path !== localizePath('/betting'));

  const timer = ref<any>();
  const disabledTransition = ref<boolean>(true);
  const layoutClasses = computed(() => [
    'main-layout',
    { 'drawer-minimize': isDrawerCompact.value },
    { 'stop-transition': disabledTransition.value },
  ]);

  const checkDrawer = ():void => {
    const clientCompactDrawer = localStorage.getItem('IS_DRAWER_COMPACT');
    isDrawerCompact.value = clientCompactDrawer === 'true';
  };

  onMounted(async () => {
    checkDrawer();
    disabledTransition.value = false;
    const cookieValue = useCookie('accept-cookie');
    if (!cookieValue.value) {
      timer.value = setTimeout(() => {
        showCookiePopup.value = true;
      }, 1500);
    }
  });

  onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value);
  });
</script>
