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

<style lang="scss" src="./style.scss"/>
