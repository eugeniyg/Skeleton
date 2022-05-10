<template>
  <div class="opacity-layer" @click="hide"/>
</template>

<script setup lang="ts">
  const {
    isDrawerOpen,
    isUserNavOpen,
    isCurrencyNavOpen,
    toggleDrawer,
    closeUserNav,
    closeCurrencyNav,
  } = useLayoutStore();

  function hide():void {
    if (isDrawerOpen.value) toggleDrawer();
    else if (isUserNavOpen.value) closeUserNav();
    else if (isCurrencyNavOpen.value) closeCurrencyNav();
  }
</script>

<style lang="scss" src="./style.scss"/>
