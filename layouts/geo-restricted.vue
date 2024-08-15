<template>
  <div class="geo-restricted">
    <atomic-image class="geo-restricted__logo" src="/img/logo-light.svg" />

    <div class="geo-restricted__content">
      <div class="geo-restricted__image"></div>
      <h1 class="geo-restricted__title"></h1>
      <div class="geo-restricted__description"></div>
      <div class="geo-restricted__address"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { setPageMeta } = useProjectMethods();
  setPageMeta({});
</script>

<style src="~/assets/styles/layouts/locked.scss" lang="scss" />

