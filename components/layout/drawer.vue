<template>
  <div class="drawer" :class="{ 'is-compact' : isDrawerCompact }">
    <div class="header">
      <button-toggle-drawer
        @toggle-minimize="compactDrawer(!isDrawerCompact)"
        @toggle-open="emit('toggle-open')"
      />

      <button-toggler :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'gamesToggler')"/>
    </div>

    <div class="content">

      <cta-menu v-if="sidebarContent?.ctaMenu.isShow" :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'ctaMenu.items')" />

      <template v-if="isLoggedIn">
        <card-profile/>
        <atomic-divider/>
      </template>

      <nav-list :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'topMenu')"/>
      <atomic-divider/>

      <!-- OPTIONAL MENU -->
      <nav-list :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'tokenMenu')"/>
      <atomic-divider/>
      <!-- OPTIONAL MENU -->

      <nav-list :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'bonusesMenu')"/>
      <atomic-divider/>

      <template v-if="isLoggedIn">
        <nav-list :items="userMenuContent"/>
        <atomic-divider/>
      </template>

      <atomic-select-lang/>
      <atomic-divider/>
      <nav-list :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'bottomMenu')"/>
      <atomic-divider/>
      <nav-static :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'sidebarFooterMenu')"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { MenuItemInterface } from '@skeleton/types';

  const { sidebarContent, defaultLocaleSidebarContent } = useGlobalStore();
  const { getContent } = useProjectMethods();
  const emit = defineEmits(['toggle-open']);

  const layoutStore = useLayoutStore();
  const { compactDrawer } = layoutStore;
  const { isDrawerCompact } = storeToRefs(layoutStore);

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const gamesStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gamesStore);
  const userMenuContent = computed(() => getContent(sidebarContent, defaultLocaleSidebarContent, 'userMenu')?.map((menuItem: MenuItemInterface) => {
    if (menuItem.url === '/favorites') return { ...menuItem, counter: favoriteGames.value.length };
    return menuItem;
  }));
</script>

<style src="~/assets/styles/components/layout/drawer.scss" lang="scss" />
