<template>
  <nuxt-link class="logo" :to="localizePath('/')">
    <picture>
      <source srcset="/img/logo-light.svg" media="(min-width: 33rem)" />
      <img class="img" src="/img/logo-short.svg" />
    </picture>
  </nuxt-link>
</template>

<script setup lang="ts">
  const { localizePath } = useProjectMethods();
</script>

<style src="~/assets/styles/components/atomic/logo.scss" lang="scss" />
