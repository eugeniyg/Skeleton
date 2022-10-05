<template>
  <nuxt-link class="logo" :to="localizePath('/')">
    <picture>
      <source srcset="/svg/logo-light.svg" media="(min-width: 33rem)" />
      <img class="img" src="~/assets/svg/logo-short.svg" />
    </picture>
  </nuxt-link>
</template>

<script setup lang="ts">
  const { localizePath } = useProjectMethods();
</script>

<style lang="scss">
.logo {
  display: flex;

  .img {
    display: inherit;
  }
}
</style>
