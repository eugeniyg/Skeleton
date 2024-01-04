<template>
  <div class="drawer" :class="{ 'is-compact' : isDrawerCompact }">
    <div class="header">
      <button-toggler :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.gamesToggler')"/>
    </div>

    <div class="content">
      <cta-menu
        v-if="layoutData?.siteSidebar?.ctaMenu?.isShow"
        :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.ctaMenu.items')"
      />
      
      <partners
        v-if="layoutData?.siteSidebar?.partners?.isShow"
        :label="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.partners.label')"
        :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.partners.items')"
      />
      
      <nav-list :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.topMenu.items')"/>
      <atomic-divider/>


      <nav-list :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.bonusesMenu')"/>
      <atomic-divider/>

      <template v-if="isLoggedIn">
        <nav-list :items="userMenuContent"/>
        <atomic-divider/>
      </template>

      <atomic-select-lang />

      <client-only>
        <div v-if="projectHasFreshchat" class="nav-list">
          <div class="item" :class="{ 'chat-indicator': newMessages }">
            <div class="link" @click="openChat">
              <atomic-icon id="live-support" />
              <div class="text">{{ getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.chatLabel') }}</div>
            </div>
          </div>
        </div>
      </client-only>
      <nav-list :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.bottomMenu')"/>

      <template v-if="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.socials.isShow')">
        <list-socials :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.socials.items')"/>
      </template>

      <atomic-divider/>

      <nav-static :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.sidebarFooterMenu')"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IIconLink } from '~/types';

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const { getContent } = useProjectMethods();

  const layoutStore = useLayoutStore();
  const { isDrawerCompact } = storeToRefs(layoutStore);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const gamesStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gamesStore);
  const userMenuContent = computed(() => getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.userMenu')?.map((menuItem: IIconLink) => {
    if (menuItem.url === '/favorites') return { ...menuItem, counter: favoriteGames.value.length };
    return menuItem;
  }));

  const freshchatStore = useFreshchatStore();
  const { newMessages, projectHasFreshchat } = storeToRefs(freshchatStore);

  const openChat = () => {
    window.fcWidget?.open();
  }
</script>

<style src="~/assets/styles/components/layout/drawer.scss" lang="scss" />
