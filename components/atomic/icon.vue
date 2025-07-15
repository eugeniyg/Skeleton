<template>
  <component :is="getComponentName" v-if="props.id" class="icon" :filled="props.filled" />
</template>

<script setup lang="ts">
  const props = defineProps<{
    id: Maybe<string>;
    filled?: boolean;
  }>();

  const getComponentName = computed(() => {
    if (!props.id) return '';
    if (props.filled) return `svgo-filled-${props.id}`;
    return `svgo-empty-${props.id}`;
  });
</script>

<style src="~/assets/styles/components/atomic/icon.scss" lang="scss" />
