<template>
  <div :class="layoutClasses">
    <atomic-preloader/>

    <layout-header
      @logout="logout"
    />

    <layout-drawer
      @toggle-open="toggleOpen"
    />

    <main
      class="app-main"
      :class="{'is-overflow': isHomePage, 'is-overflow-initial': isProfileLimitsPage }"
      :data-route="route.name"
    >
      <slot />
    </main>

    <layout-footer />

    <atomic-opacity-layer />

    <client-only>
      <transition name="fade" mode="out-in">
        <layout-game-return
          v-if="showReturnGame"
          :game="returnGame"
        />
      </transition>
    </client-only>

    <transition name="fade" mode="out-in">
      <nav-mob v-if="!isGamePage" />
    </transition>

    <transition name="fade-down">
      <layout-cookies v-if="showCookiesMessage" />
    </transition>

    <modal-register />
    <modal-register-cancel />
    <modal-one-click />
    <modal-sign-in />
    <modal-forgot-pass />
    <modal-reset-pass />
    <modal-success />
    <modal-error />
    <modal-confirm />
    <modal-fiat />
    <modal-mobile-game />
    <modal-wallet />
    <!--    <modal-wallet-choose-region />-->
    <modal-cancel-deposit />
    <modal-wallet-bonus-details />

    <atomic-alert />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const globalStore = useGlobalStore();
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { localizePath } = useProjectMethods();

  const { isMobile } = storeToRefs(globalStore);

  const {
    showCookiePopup,
    isDrawerCompact,
    returnGame,
    isHomePage,
    isGamePage,
    isSportsbookPage
  } = storeToRefs(layoutStore);

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

  const isProfileLimitsPage = computed(() => {
    const routeName = route.name as string;
    return routeName.includes('profile-limits');
  });

  const timer = ref<any>();
  const disabledTransition = ref<boolean>(true);
  const layoutClasses = computed(() => [
    'main-layout',
    { 'drawer-minimize': isDrawerCompact.value },
    { 'stop-transition': disabledTransition.value },
  ]);

  const checkDrawer = ():void => {
    if (isGamePage.value) return;
    const clientCompactDrawer = localStorage.getItem('IS_DRAWER_COMPACT');
    isDrawerCompact.value = clientCompactDrawer === 'true';
  };

  const showReturnGame = computed(() => {
    return returnGame.value
      && returnGame.value !== 'disabled'
      && isMobile.value
      && !isGamePage.value
      && !isSportsbookPage.value;
  });

  onBeforeMount(() => {
    const storageReturnGame = sessionStorage.getItem('returnGame');
    if (storageReturnGame) returnGame.value = JSON.parse(storageReturnGame);
  });

  const { checkModals } = useLayoutStore();
  onMounted(async () => {
    checkModals();
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
