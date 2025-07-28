<template>
  <div class="btn-providers">
    <atomic-icon id="providers" class="btn-providers__icon" />
    <span class="btn-providers__label">{{
      getContent(layoutData, defaultLocaleLayoutData, 'categoryMenu.providersButton')
    }}</span>
    <atomic-icon id="dropdown-arrows" class="btn-providers__icon" />
  </div>
</template>

<script setup lang="ts">
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
</script>

<style src="~/assets/styles/components/button/providers.scss" lang="scss" />
