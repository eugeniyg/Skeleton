<template>
  <div class="opacity-layer" @click="hide"/>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const layoutStore = useLayoutStore();
  const { isDrawerOpen, isUserNavOpen, isCurrencyNavOpen } = storeToRefs(layoutStore);
  const { toggleDrawer, closeUserNav, closeCurrencyNav } = layoutStore;

  function hide():void {
    if (isDrawerOpen.value) toggleDrawer();
    else if (isUserNavOpen.value) closeUserNav();
    else if (isCurrencyNavOpen.value) closeCurrencyNav();
  }
</script>

<style lang="scss">
.opacity-layer {
  background-color: var(--opacity-layer-bg, rgba(0, 0, 0, 0.88));
  backdrop-filter: blur(8px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 2;
  transition: opacity .2s .2s ease-in;
  visibility: var(--opacity-layer-visibility, hidden);
}
</style>
