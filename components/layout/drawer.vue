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
      <template v-if="isLoggedIn">
        <card-profile/>
        <atomic-divider/>
      </template>

      <nav-list :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'topMenu')"/>
      <atomic-divider/>
      <nav-list :items="getContent(sidebarContent, defaultLocaleSidebarContent, 'tokenMenu')"/>
      <atomic-divider/>
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
  import { MenuItemInterface } from '~/types';

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

<style lang="scss">
.drawer {
  background-color: var(--gray-800);
  grid-area: drawer;
  transition: var(--drawer-transition, (transform .2s ease-out));
  width: var(--drawer-width, #{rem(240px)});
  position: var(--drawer-position, fixed);
  top: 0;
  left: 0;
  height: calc(var(--vh, 1vh) * 100);
  visibility: var(--drawer-visibility, visible);
  transform: var(--drawer-translate-x, translateX(calc(-100% - #{rem(32px)})));
  z-index: 3;
  will-change: transform;

  @include media(l) {
    --drawer-visibility: visible;
  }

  .header {
    background-color: var(--drawer-header-bg, var(--gray-800));
    padding: var(--drawer-header-padding, 0);
    position: relative;
    display: grid;
    top: 0;
    z-index: 1;
    grid-row-gap: var(--drawer-header-row-gap, 0);
    min-height: rem(64px);

    .drawer-minimize &, .drawer-open & {
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.16);
    }

    .drawer-open & {
      --drawer-header-bg: var(--gray-900);
    }

    .drawer-minimize & {
      @include media(l) {
        --drawer-header-bg: var(--gray-800);
        --drawer-header-padding: 0 0 16px 0;

        &:after {
          content: '';
          position: absolute;
          display: block;
          left: 16px;
          right: 16px;
          bottom: 0;
          border-bottom: 1px solid var(--gray-700);
        }
      }
    }
  }

  .content {
    @include scrollbar-hide;
    height: var(--drawer-content-height, calc(var(--vh, 1vh) * 100 - #{rem(62px)} - #{rem(24px)}));
    position: relative;
    z-index: 0;
    padding: var(--drawer-content-padding, (#{rem(16px)} #{rem(16px)} #{rem(40px)} #{rem(16px)}));
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    margin: var(--margin-content, #{rem(8px)} 0 #{rem(8px)} 0);

    .drawer-minimize & {
      --margin-content: #{rem(16px)} 0 #{rem(8px)} 0
    }

    @include media(l) {
      .drawer-minimize & {
        @include scrollbar-hide;
        --drawer-content-padding: 0 #{rem(16px)} #{rem(16px)};
      }

      .drawer-open.drawer-minimize & {
        --drawer-content-height: calc(var(--vh, 1vh) * 100 - #{rem(160px)});
      }
    }

    .drawer-open & {
      //--drawer-content-padding: #{rem(16px)};
      --drawer-content-height: calc(var(--vh, 1vh) * 100 - #{rem(62px)} - #{rem(24px)});
    }

  }

  &.is-compact {
    @include media(l) {
      --drawer-width: #{rem(72px)};
      --drawer-header-row-gap: #{rem(16px)};
      --drawer-content-height: calc(var(--vh, 1vh) * 100 - #{rem(200px)})
    }
  }

  .avatar {
    border-radius: 16px;
  }
}
</style>
