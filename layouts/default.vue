<template>
  <div :class="layoutClasses">
    <atomic-preloader/>

    <layout-header
      :is-logged-in="isLoggedIn"
      @logout="logout"
    />

    <client-only>
      <layout-drawer
        :is-logged-in="isLoggedIn"
        :is-compact="IS_DRAWER_COMPACT"
        @compact="compact"
        @toggle-open="toggleOpen"
      />
    </client-only>

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

    <client-only>
      <modal-register />
      <modal-sign-in />
      <modal-forgot-pass />
      <modal-reset-pass />
      <modal-deposit />
      <modal-withdraw />
      <modal-success />
      <modal-error />
      <modal-confirm />
    </client-only>

    <atomic-alert
      :isShow="isShowAlert"
      v-bind="alertProps"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { needToChangeLanguage } = useProjectMethods();
  const cookieLanguage = useCookie('user-language');
  const route = useRoute();

  if (needToChangeLanguage()) {
    await navigateTo(`/${cookieLanguage.value}${route.fullPath === '/' ? '' : route.fullPath}`, { replace: true });
  }

  const { getCommonData, getInitUserInformation } = useGlobalStore();
  useLazyAsyncData('commonData', getCommonData);

  const IS_DRAWER_COMPACT = useCookie<boolean>('IS_DRAWER_COMPACT', { maxAge: 60 * 60 * 24 * 365 * 10 });
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isHomePage, localizePath } = useProjectMethods();

  const {
    isShowAlert, alertProps, showCookiePopup,
  } = storeToRefs(layoutStore);
  const { compactDrawer, checkModals } = layoutStore;
  checkModals();

  const { logOutUser } = profileStore;
  const { isLoggedIn } = storeToRefs(profileStore);

  function logout():void {
    logOutUser();
  }

  function compact():void {
    IS_DRAWER_COMPACT.value = !IS_DRAWER_COMPACT.value;
    compactDrawer();
  }

  function toggleOpen():void {
    layoutStore.toggleDrawer();
  }

  const showCookiesMessage = computed(() => showCookiePopup.value
    && route.name !== 'games-id'
    && route.name !== 'locale-games-id'
    && route.path !== localizePath('/betting'));

  const timer = ref<any>();
  const disabledTransition = ref<boolean>(true);
  const layoutClasses = computed(() => [
    'main-layout',
    { 'drawer-minimize': IS_DRAWER_COMPACT.value },
    { 'stop-transition': disabledTransition.value },
  ]);

  onMounted(async () => {
    disabledTransition.value = false;
    const cookieValue = useCookie('accept-cookie');
    if (!cookieValue.value) {
      timer.value = setTimeout(() => {
        showCookiePopup.value = true;
      }, 1500);
    }
    await getInitUserInformation();
  });

  onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value);
  });
</script>
