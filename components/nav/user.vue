<template>
  <nav class="nav-user">
    <atomic-avatar-user/>

    <div class="items">
      <div
        v-for="(item, index) in profileLinks"
        :key="index"
        class="item"
        :class="{ 'is-active': $route.path === localizePath(item.url) }"
        @click="clickItem(item.url)"
      >
        <atomic-icon :id="item.icon" />
        {{ item.label }}
      </div>
    </div>

    <atomic-divider/>
    <button-logout @logout="emit('logout')"/>
  </nav>
</template>

<script setup lang="ts">
  const emit = defineEmits(['logout']);
  const { localizePath } = useProjectMethods();
  const { closeUserNav } = useLayoutStore();
  const { userNavigationContent } = useGlobalStore();
  const profileLinks = userNavigationContent?.profileLinks || [];

  function clickItem(url: string):void {
    const router = useRouter();
    router.push(localizePath(url));
    closeUserNav();
  }
</script>

<style lang="scss">
.nav-user {
  display: grid;
  grid-auto-rows: min-content;
  background-color: var(--gray-800);
  padding: rem(16px);
  width: var(--width, #{rem(288px)});
  z-index: 1;
  grid-gap: rem(8px);
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.24);

  top: rem(64px);
  right: 0;
  height: calc(var(--vh, 1vh) * 100);
  position: fixed;
  align-items: flex-start;
  visibility: var(--nav-user-visibility, hidden);
  transform: translateX(var(--nav-user-translate-x, 100%));
  transition: all .4s  ease-in;

  @include media(sm) {
    transition: none;
    height: auto;
    border-radius: 8px;
    right: rem(32px);
    top: rem(56px);
    max-width: 198px;
  }

  .items {
    display: grid;
    grid-row-gap: rem(8px);

    @include media(sm) {
      grid-row-gap: rem(2px);
    }
  }

  .item {
    @include font($body-1);
    color: var(--color, var(--white));
    display: flex;
    align-items: center;
    padding: rem(6px) rem(8px);
    grid-column-gap: rem(8px);
    align-self: stretch;
    flex-grow: 0;
    border-radius: 4px;
    background-color: var(--bg, transparent);
    transition: color .2s ease-in-out;

    .icon {
      --color: var(--gray-400);
      --icon-size: 20px;
    }

    &:hover {
      --bg: var(--gray-700);
      --color: var(--white);
      cursor: pointer;

      .icon {
        --color: var(--white);
      }
    }

    &.is-active {
      --color: var(--yellow-500);
      --bg: var(--gray-700);

      .icon {
        color: inherit;
      }
    }
  }

  hr {
    --margin: 0;
  }
}
</style>
