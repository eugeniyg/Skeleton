<template>
  <header class="app-header" :class="headerClassModifiers">
    <button class="app-header__back-btn" @click="backToHomePage" v-if="isGamePage && isLoggedIn">
      <atomic-icon id="arrow_previous"/>
    </button>

    <atomic-logo />

    <!--<template v-if="!isGamePage">-->
      <atomic-vertical-divider/>

      <button-search
        data-show="mobile"
        @show-search="toggle"
        :is-active="isShowSearch"
      />

      <atomic-gift-notification
        v-if="isLoggedIn"
        display="mobile"
        :is-active="!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)"
      />
    <!--</template>-->

    <div class="items">
      <search
        :isShow="isShowSearch"
        @hideSearch="isShowSearch = false"
      />

      <button-search
        data-show="desktop"
        @show-search="toggle"
        :is-active="isShowSearch"
      />

      <template v-if="isLoggedIn">
        <atomic-gift-notification
          display="desktop"
          :is-active="!!(activePlayerBonuses?.length || activePlayerFreeSpins?.length)"
        />
        <!--
        <atomic-notification :is-active="!!fakeStore.items.notifications.length"/>
        <popover-notifications :items="fakeStore.items.notifications" :max="5"/>
        -->
        <form-input-deposit/>

        <div v-click-outside="closeUserNav" class="nav-user__wrap">
          <atomic-avatar
            @toggle="toggleProfileNav"
            :is-button="true"
          />
          <nav-user @logout="logout"/>
        </div>

      </template>

      <template v-else>
        <button-base
          type="primary"
          size="md"
          @click="showModal('register')"
        >
          <atomic-icon id="user-new" class="btn-primary__icon"/>
          <span class="btn-primary__text">{{ getContent(headerContent, defaultLocaleHeaderContent, 'registrationButton') }}</span>
        </button-base>

        <button-base
          type="secondary"
          size="md"
          @click="showModal('signIn')"
        >
          <atomic-icon id="user" class="btn-secondary__icon"/>
          <span class="btn-secondary__text">{{ getContent(headerContent, defaultLocaleHeaderContent, 'loginButton') }}</span>
        </button-base>
      </template>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const emit = defineEmits(['login', 'register', 'logout']);
  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const bonusStore = useBonusStore();
  const { headerContent, defaultLocaleHeaderContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const { isUserNavOpen } = storeToRefs(layoutStore);
  const { closeUserNav, openUserNav, showModal } = layoutStore;
  const { isLoggedIn } = storeToRefs(profileStore);
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);
  const { isGamePage } = storeToRefs(layoutStore);

  const headerClassModifiers = computed(() => {
    if (isGamePage.value && isLoggedIn.value) {
      return 'app-header--is-game-page-login'
    } else if(isGamePage && !isLoggedIn.value) {
      return 'app-header--is-game-page-logout'
    } else return ''
  })

  function toggleProfileNav():void {
    if (isUserNavOpen.value) closeUserNav();
    else openUserNav();
  }

  function close():void {
    closeUserNav();
  }

  function logout():void {
    close();
    emit('logout');
  }

  const isShowSearch = ref<boolean>(false);

  const toggle = () => {
    isShowSearch.value = !isShowSearch.value;
  };

  const checkSearch = (e:any):void => {
    if (isShowSearch.value && !e.target.closest('.search') && !e.target.closest('.btn-search')) {
      isShowSearch.value = false;
    }
  };

  const backToHomePage = () => {
    const router = useRouter();
    const { localizePath } = useProjectMethods();
    router.push(localizePath('/'));
  }

  onMounted(() => {
    document.addEventListener('click', checkSearch);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', checkSearch);
  });
</script>

<style src="~/assets/styles/components/layout/header.scss" lang="scss" />

