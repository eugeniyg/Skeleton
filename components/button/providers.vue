<template>
  <div
    class="btn-providers"
    :class="{'is-active': props.isActive}"
    @click="emit('action')"
  >
    <atomic-icon id="providers" class="btn-providers__icon"/>
    <span class="btn-providers__label">{{ getContent(layoutData, defaultLocaleLayoutData, 'categoryMenu.providersButton') }}</span>
    <atomic-icon id="dropdown-arrows" class="btn-providers__icon"/>
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

<style src="~/assets/styles/components/button/providers.scss" lang="scss"/>
