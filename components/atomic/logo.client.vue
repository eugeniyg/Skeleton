<template>
  <atomic-link class="logo" href="/">
    <picture>
      <source srcset="/img/logo-light.svg" :media="`(min-width: ${media})`" />
      <atomic-image class="img" src="/img/logo-short.svg" />
    </picture>
  </atomic-link>
</template>

<script setup lang="ts">
  const layoutStore = useLayoutStore();
  const { isGamePage } = storeToRefs(layoutStore);

  const media = computed(() => {
    return isGamePage.value ? '64rem' : '33rem';
  });
</script>

<style src="~/assets/styles/components/atomic/logo.scss" lang="scss" />
