<template>
  <div class="drawer" :class="{'is-compact' : props.isCompact}">
    <div class="header">
      <button-toggle-drawer @toggle-minimize="emit('compact')" @toggle-open="$emit('toggle-open')"/>
      <button-toggler :items="sidebarContent?.gamesToggler"/>
    </div>

    <div class="content">
      <client-only>
        <template v-if="props.isLoggedIn">
          <card-profile/>
          <atomic-divider/>
        </template>
      </client-only>
      <nav-list :items="sidebarContent?.topMenu"/>
      <atomic-divider/>
      <nav-list :items="sidebarContent?.tokenMenu"/>
      <atomic-divider/>
      <nav-list :items="sidebarContent?.bonusesMenu"/>
      <atomic-divider/>
      <template v-if="props.isLoggedIn">
        <nav-list  :items="sidebarContent?.userMenu"/>
        <atomic-divider/>
      </template>
      <atomic-select-lang/>
      <atomic-divider/>
      <nav-list :items="sidebarContent?.bottomMenu"/>
      <atomic-divider/>
      <nav-static :items="sidebarContent?.sidebarFooterMenu"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isCompact: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  });
  const { sidebarContent } = useGlobalStore();
  const emit = defineEmits(['compact', 'toggleOpen']);
</script>

<style lang="scss">
.drawer {
  background-color: var(--gray-800);
  grid-area: drawer;
  transition: var(--drawer-transition, (transform .2s ease-out));
  width: var(--drawer-width, #{rem(240px)});
  position: var(--drawer-position, fixed);
  top: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
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
    height: var(--drawer-content-height, calc(100vh - #{rem(62px)} - #{rem(24px)}));
    position: relative;
    z-index: 0;
    padding: var(--drawer-content-padding, (#{rem(16px)} #{rem(20px)} #{rem(40px)} #{rem(20px)}));
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
        --drawer-content-height: calc(100vh - #{rem(160px)});
      }
    }

    .drawer-open & {
      //--drawer-content-padding: #{rem(16px)};
      --drawer-content-height: calc(100vh - #{rem(62px)} - #{rem(24px)});
    }

  }

  &.is-compact {
    @include media(l) {
      --drawer-width: #{rem(72px)};
      --drawer-header-row-gap: #{rem(16px)};
      --drawer-content-height: calc(100vh - #{rem(200px)})
    }
  }

  .avatar {
    border-radius: 16px;
  }
}
</style>
