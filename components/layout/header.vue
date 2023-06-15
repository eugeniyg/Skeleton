<template>
  <header class="app-header">
    <atomic-logo/>

    <atomic-vertical-divider/>

    <button-search
      data-show="mobile"
      @show-search="toggle"
      :is-active="isShowSearch"
    />

    <atomic-gift-notification
      v-if="isLoggedIn"
      display="mobile"
      :is-active="!!activePlayerBonuses.length"
    />

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
          :is-active="!!activePlayerBonuses.length"
        />
        <!--
        <atomic-notification :is-active="!!fakeStore.items.notifications.length"/>
        <popover-notifications :items="fakeStore.items.notifications" :max="5"/>
        -->
        <form-input-deposit/>

        <div v-click-outside="closeUserNav">
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
          {{ headerContent?.registrationButton || defaultLocaleHeaderContent?.registrationButton }}
        </button-base>

        <button-base
          type="secondary"
          size="md"
          @click="showModal('signIn')"
        >
          {{ headerContent?.loginButton || defaultLocaleHeaderContent?.loginButton }}
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
  const { isUserNavOpen } = storeToRefs(layoutStore);
  const { closeUserNav, openUserNav, showModal } = layoutStore;
  const { isLoggedIn } = storeToRefs(profileStore);
  const { activePlayerBonuses } = storeToRefs(bonusStore);

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

  onMounted(() => {
    document.addEventListener('click', checkSearch);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', checkSearch);
  });
</script>

<style src="~/assets/styles/components/layout/header.scss" lang="scss" />

