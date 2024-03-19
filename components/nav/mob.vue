<template>
  <div class="nav-mob" v-if="!isGamePage">
    <button-base class="nav-mob__item" @click.prevent="layoutStore.toggleDrawer()">
      <atomic-icon id="menu"/>
      <span class="nav-mob__text">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.menuLabel') }}
      </span>
    </button-base>

    <button-base
      class="nav-mob__item"
      :class="{ active: route.path === localizePath(gamesButtons?.buttonFirst.url) || route.query.category }"
      :url="gamesButtons?.buttonFirst.url"
    >
      <atomic-icon :id="gamesButtons?.buttonFirst.icon" />
      <span class="nav-mob__text">
        {{ gamesButtons?.buttonFirst.label }}
      </span>
    </button-base>

    <client-only>
      <button-base class="nav-mob__item is-accent" @click.prevent="clickMainButton">
        <atomic-icon :id="isLoggedIn ? 'wallet' : 'user-new'"/>
        <client-only>
          <span class="nav-mob__text">
            {{
              isLoggedIn
                ? getContent(layoutData, defaultLocaleLayoutData, 'header.depositButton')
                : getContent(layoutData, defaultLocaleLayoutData, 'header.registrationButton')
            }}
          </span>
        </client-only>
      </button-base>
    </client-only>

    <button-base
      class="nav-mob__item"
      :class="{ active: route.path === localizePath(gamesButtons?.buttonSecond.url) }"
      :url="gamesButtons?.buttonSecond.url"
    >
      <atomic-icon :id="gamesButtons?.buttonSecond.icon" />
      <span class="nav-mob__text">{{ gamesButtons?.buttonSecond.label }}</span>
    </button-base>

    <client-only>
      <button-base
        v-if="projectHasFreshchat"
        class="nav-mob__item"
        :class="{ 'chat-indicator': newMessages }"
        @click="openChat"
      >
        <atomic-icon id="live-support" />
        <span class="nav-mob__text">
        {{ getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.chatLabel') }}
      </span>
      </button-base>

      <button-base
        v-else-if="contactButton"
        class="nav-mob__item"
        :class="{ active: route.path === localizePath(contactButton.url) }"
        :url="contactButton.url"
      >
        <atomic-icon :id="contactButton.icon" />
        <span class="nav-mob__text">{{ contactButton.label }}</span>
      </button-base>
    </client-only>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { showModal, openWalletModal } = useLayoutStore();
  const { isGamePage } = storeToRefs(layoutStore);
  const {
    layoutData,
    defaultLocaleLayoutData
  } = useGlobalStore();
  const { localizePath, getContent } = useProjectMethods();
  const route = useRoute();

  const clickMainButton = ():void => {
    isLoggedIn.value ? openWalletModal() : showModal('register');
  };

  const gamesButtons = computed(() => {
    return getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.gamesToggler');
  })
  const contactButton = computed(() => {
    return getContent(layoutData, defaultLocaleLayoutData, 'mobileMenu.contactButton');
  })

  const freshchatStore = useFreshchatStore();
  const { newMessages, projectHasFreshchat } = storeToRefs(freshchatStore);

  const openChat = () => {
    const { public: { freshchatParams } } = useRuntimeConfig();
    if (!freshchatParams?.guestAvailable && !isLoggedIn.value) showModal('register');
    else window.fcWidget?.open();
  }
</script>

<style src="~/assets/styles/components/nav/mob.scss" lang="scss" />

