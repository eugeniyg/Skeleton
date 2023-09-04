<template>
  <div class="drawer" :class="{ 'is-compact' : isDrawerCompact }">
    <div class="header">
      <button-toggle-drawer
        @toggle-minimize="compactDrawer(!isDrawerCompact)"
        @toggle-open="emit('toggle-open')"
      />

      <button-toggler :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.gamesToggler')"/>
    </div>

    <div class="content">
      <cta-menu v-if="layoutData?.siteSidebar?.ctaMenu?.isShow" :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.ctaMenu.items')" />

      <nav-list :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.topMenu')"/>
      <atomic-divider/>


      <nav-list :items="getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.bonusesMenu')"/>
      <atomic-divider/>

      <template v-if="isLoggedIn">
        <nav-list :items="userMenuContent"/>
        <atomic-divider/>
      </template>

      <atomic-select-lang/>

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
  import { IIconLink } from '~/types';

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const emit = defineEmits(['toggle-open']);

  const layoutStore = useLayoutStore();
  const { compactDrawer } = layoutStore;
  const { isDrawerCompact } = storeToRefs(layoutStore);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const gamesStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gamesStore);
  const userMenuContent = computed(() => getContent(layoutData, defaultLocaleLayoutData, 'siteSidebar.userMenu')?.map((menuItem: IIconLink) => {
    if (menuItem.url === '/favorites') return { ...menuItem, counter: favoriteGames.value.length };
    return menuItem;
  }));
</script>

<style src="~/assets/styles/components/layout/drawer.scss" lang="scss" />
