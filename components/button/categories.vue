<template>
  <div
    class="btn-categories"
    :class="{'is-active': props.isActive}"
    @click="emit('action')"
  >
    <atomic-icon class="btn-categories__icon" id="more-menu"/>
    <span class="btn-categories__label">{{ getContent(layoutData, defaultLocaleLayoutData , 'categoryMenu.categoriesButton') }}</span>
    <atomic-icon id="dropdown-arrows" class="btn-categories__icon"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isActive?: boolean;
  }>();
  
  const { layoutData, defaultLocaleLayoutData } = useGlobalStore();
  const { getContent } = useProjectMethods();
  
  const emit = defineEmits(['action']);
</script>

<style src="~/assets/styles/components/button/categories.scss" lang="scss" />
