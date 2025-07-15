<template>
  <header class="app-header-root" @animationend="bar.updateCssVars">
    <atomic-notification-bar ref="bar" />

    <client-only>
      <pwa v-if="isLoggedIn" display="mobile" />
    </client-only>

    <div ref="appHeader" class="app-header" :class="headerClassValue">
      <client-only>
        <button v-if="isGamePage && isLoggedIn" class="app-header__back-btn" @click="backToHomePage">
          <atomic-icon id="arrow_previous" />
        </button>
      </client-only>

      <button-toggle-drawer @toggle-minimize="compactDrawer(!isDrawerCompact)" @toggle-open="emit('toggle-open')" />

      <atomic-logo />

      <button-toggler :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.gamesToggler')" />

      <!--<template v-if="!isGamePage">-->
      <atomic-vertical-divider />

      <button-search data-show="mobile" :is-active="isShowSearch" @show-search="toggle" />

      <client-only>
        <atomic-gift-notification
          v-if="isLoggedIn"
          display="mobile"
          :is-active="!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)"
        />
      </client-only>
      <!--</template>-->

      <div class="items">
        <button-base v-if="isGameDemo" type="secondary" size="sm" class="app-header__play-real" @click="changeGameMode">
          <atomic-icon id="casino-real-money" />
          <span>{{ getContent(layoutData, defaultLocaleLayoutData, 'header.playRealButton') }}</span>
        </button-base>

        <template v-if="isGamePage && !isGameDemo">
          <wager-tooltip :container="appHeader" />
        </template>

        <search :is-show="isShowSearch" @hide-search="isShowSearch = false" />

        <button-search data-show="desktop" :is-active="isShowSearch" @show-search="toggle" />

        <atomic-divider v-if="isGamePage" />

        <client-only>
          <template v-if="isLoggedIn">
            <atomic-gift-notification
              display="desktop"
              :is-active="!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)"
            />

            <pwa display="desktop" />

            <div class="app-header__notifications">
              <notification-popover-activator
                :popover-show="isShowNotifications"
                @toggle="isShowNotifications = !isShowNotifications"
              />

              <notification-popover v-if="isShowNotifications" @hide="isShowNotifications = false" />
            </div>

            <form-input-deposit />

            <div v-click-outside="closeUserNav" class="nav-user__wrap">
              <div class="nav-user__header-avatar" :class="{ '--show-ring': unreadCount }">
                <loyalty-avatar size="sm" @click="toggleProfileNav" />

                <span v-show="isUserNavOpen" class="close-decor" @click="toggleProfileNav">
                  <atomic-icon id="plus" />
                </span>
              </div>

              <nav-user @logout="logout" />
            </div>
          </template>

          <template v-else>
            <button-base type="primary" size="md" @click="openModal('sign-up')">
              <atomic-icon id="user-new" class="btn-primary__icon" />
              <span class="btn-primary__text">{{
                getContent(layoutData, defaultLocaleLayoutData, 'header.registrationButton')
              }}</span>
            </button-base>

            <button-base type="secondary" size="md" @click="openModal('sign-in')">
              <atomic-icon id="user" class="btn-secondary__icon" />
              <span class="btn-secondary__text">{{
                getContent(layoutData, defaultLocaleLayoutData, 'header.loginButton')
              }}</span>
            </button-base>
          </template>
        </client-only>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  const emit = defineEmits(['logout', 'toggle-open']);
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const bonusStore = useBonusStore();
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const { isUserNavOpen } = storeToRefs(layoutStore);
  const { closeUserNav, openUserNav, compactDrawer } = layoutStore;
  const { openModal } = useModalStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);
  const { isGamePage, isDrawerCompact } = storeToRefs(layoutStore);
  const notificationStore = useNotificationStore();
  const { unreadCount } = storeToRefs(notificationStore);

  const appHeader = ref<HTMLElement>();
  const bar = ref();

  const headerClassModifiers = computed(() => {
    if (isGamePage.value && isLoggedIn.value) {
      return 'app-header--is-game-page-login';
    } else if (isGamePage.value && !isLoggedIn.value) {
      return 'app-header--is-game-page-logout';
    } else return '';
  });

  const headerClassValue = ref<string>('');
  watch(
    () => headerClassModifiers.value,
    newValue => {
      headerClassValue.value = newValue;
    }
  );

  function toggleProfileNav(): void {
    if (isUserNavOpen.value) closeUserNav();
    else openUserNav();
  }

  function close(): void {
    closeUserNav();
  }

  function logout(): void {
    close();
    emit('logout');
  }

  const isShowSearch = ref<boolean>(false);

  const toggle = () => {
    isShowSearch.value = !isShowSearch.value;
  };

  const checkSearch = (e: any): void => {
    if (isShowSearch.value && !e.target.closest('.search') && !e.target.closest('.btn-search')) {
      isShowSearch.value = false;
    }
  };

  const backToHomePage = () => {
    const router = useRouter();
    if (window.history.state.back) {
      router.back();
    } else {
      router.push(localizePath('/'));
    }
  };

  const route = useRoute();
  const isGameDemo = computed(() => {
    return isGamePage.value && route.query?.real !== 'true';
  });

  const changeGameMode = () => {
    useEvent('changeMobileGameMode');
  };

  const isShowNotifications = ref<boolean>(false);

  onMounted(() => {
    headerClassValue.value = headerClassModifiers.value;
    document.addEventListener('click', checkSearch);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', checkSearch);
  });
</script>

<style src="~/assets/styles/components/layout/header.scss" lang="scss" />
