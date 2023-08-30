<template>
  <nuxt-link class="logo" :to="localizePath('/')">
    <picture>
      <source
        srcset="/img/logo-light.svg"
        :media="`(min-width: ${media})`"
      />
      <img class="img" src="/img/logo-short.svg" />
    </picture>
  </nuxt-link>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const { localizePath } = useProjectMethods();
  const layoutStore = useLayoutStore();
  const { isGamePage } = storeToRefs(layoutStore);

  const media = computed(() => {
    return isGamePage.value ? '64rem': '33rem'
  })
</script>

<style src="~/assets/styles/components/atomic/logo.scss" lang="scss" />
