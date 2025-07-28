<template>
  <div class="drawer" :class="{ 'is-compact': isDrawerCompact }">
    <div class="header">
      <client-only>
        <atomic-link class="drawer__logo" href="/">
          <atomic-image class="img" src="/img/logo-short.svg" />
        </atomic-link>
      </client-only>

      <button-toggler :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.gamesToggler')" />

      <div class="drawer__close">
        <atomic-icon id="close" />
      </div>
    </div>

    <div class="content">
      <cta-menu
        v-if="layoutData?.siteSidebar?.ctaMenu?.isShow"
        :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.ctaMenu.items')"
      />

      <client-only>
        <atomic-link v-if="isLoggedIn && loyaltyEnabled" href="/loyalty" class="drawer__loyalty">
          <loyalty-level-logo />
          <loyalty-progress short-version />
        </atomic-link>
      </client-only>

      <partners
        v-if="layoutData?.siteSidebar?.partners?.isShow"
        :label="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.partners.label')"
        :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.partners.items')"
      />

      <nav-category-sidebar v-bind="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.topMenu')" />
      <atomic-divider />

      <nav-list :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.bonusesMenu')" />
      <atomic-divider />

      <client-only>
        <template v-if="isLoggedIn">
          <nav-list :items="userMenuContent" />
          <atomic-divider />
        </template>
      </client-only>

      <atomic-select-lang />

      <div v-if="projectHasLiveChat || projectHasFreshchat" class="nav-list">
        <div
          class="item"
          :class="{ 'chat-indicator': projectHasLiveChat ? !!liveChatNewMessages : !!freshChatNewMessages }"
        >
          <div class="link" @click="openChat">
            <atomic-icon id="live-support" />
            <div class="text">{{ getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.chatLabel') }}</div>
          </div>
        </div>
      </div>

      <nav-list :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.bottomMenu')" />

      <template v-if="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.socials.isShow')">
        <list-socials :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.socials.items')" />
      </template>

      <atomic-divider />

      <nav-static :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.sidebarFooterMenu')" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IIconLink } from '~/types';

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();

  const layoutStore = useLayoutStore();
  const { openModal } = useModalStore();
  const { isDrawerCompact } = storeToRefs(layoutStore);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const gamesStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gamesStore);
  const userMenuContent = computed(() =>
    getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.userMenu')?.map((menuItem: IIconLink) => {
      if (menuItem.url === '/favorites') return { ...menuItem, counter: favoriteGames.value.length };
      return menuItem;
    })
  );

  const freshchatStore = useFreshchatStore();
  const { freshChatNewMessages, projectHasFreshchat } = storeToRefs(freshchatStore);
  const liveChatStore = useLiveChatStore();
  const { liveChatNewMessages, projectHasLiveChat } = storeToRefs(liveChatStore);

  const {
    public: { freshchatParams, liveChat, loyaltyEnabled },
  } = useRuntimeConfig();

  const openChat = () => {
    if (projectHasLiveChat.value) {
      if (!liveChat?.guestAvailable && !isLoggedIn.value) openModal('sign-in');
      else if (window.LiveChatWidget) window.LiveChatWidget.call('maximize');
    } else if (projectHasFreshchat.value) {
      if (!freshchatParams?.guestAvailable && !isLoggedIn.value) openModal('sign-in');
      else window.fcWidget?.open();
    }
  };
</script>

<style src="~/assets/styles/components/layout/drawer.scss" lang="scss" />
