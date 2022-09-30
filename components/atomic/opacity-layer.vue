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
  background-color: var(--opacity-layer-bg, rgba(0, 0, 0, 0.72));
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  transition: opacity .2s .2s ease-in;
  visibility: var(--opacity-layer-visibility, hidden);
}
</style>
