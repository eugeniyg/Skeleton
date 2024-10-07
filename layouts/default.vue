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
      :class="mainClasses"
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
    <modal-sign-in />
    <modal-forgot-pass />
    <modal-reset-pass />
    <modal-success />
    <modal-error />
    <modal-confirm />
    <modal-fiat />
    <modal-mobile-game />
    <modal-wallet />
    <modal-wallet-choose-region />
    <modal-cancel-deposit />
    <modal-deposit-redirect/>
    <modal-wallet-bonus-info />
    <modal-turn-over-wager v-if="turnOverWagerModal" />
    <atomic-alert />

    <template v-if="questsEnabled">
      <modal-quests-hub />
      <modal-quest-rewards />
      <modal-quest-tasks />
    </template>

    <template v-if="loyaltyEnabled">
      <modal-loyalty-level />
      <modal-loyalty-earn />
    </template>
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

  const runtimeConfig = useRuntimeConfig();
  const turnOverWagerModal = runtimeConfig.public?.enableTurnOverWager;
  const questsEnabled = runtimeConfig.public?.questsEnabled;
  const loyaltyEnabled = runtimeConfig.public?.loyaltyEnabled;

  onBeforeMount(() => {
    const storageReturnGame = sessionStorage.getItem('returnGame');
    if (storageReturnGame) returnGame.value = JSON.parse(storageReturnGame);
  });

  const { checkModals } = useLayoutStore();
  const mainClasses = ref();
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

    watchEffect( () => {
      mainClasses.value = {
        'is-overflow': isHomePage.value,
        'is-overflow-initial': route.name === 'profile-limits' || route.name === 'locale-profile-limits'
      }
    });
  });

  onBeforeUnmount(() => {
    if (timer.value) clearTimeout(timer.value);
  });
</script>
