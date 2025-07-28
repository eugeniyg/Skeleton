<template>
  <div
    class="btn-categories"
    :class="{ 'is-active': props.isActive, 'is-disabled': props.disabled }"
    @click="emit('action')"
  >
    <atomic-icon id="more-menu" class="btn-categories__icon" />
    <span class="btn-categories__label">{{
      getContent(layoutData, defaultLocaleLayoutData, 'categoryMenu.categoriesButton')
    }}</span>
    <atomic-icon id="dropdown-arrows" class="btn-categories__icon" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive?: boolean;
    disabled?: boolean;
  }>();

  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();

  const emit = defineEmits(['action']);
</script>

<style src="~/assets/styles/components/button/categories.scss" lang="scss" />
