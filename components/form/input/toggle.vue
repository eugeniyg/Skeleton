<template>
  <div class="input-toggle" :class="{ 'input-toggle--checked': props.value }">
    <label class="label">
      <input class="checkbox" type="checkbox" :name="props.name" :checked="props.value" @change="emit('change')" />

      <div class="slider">
        <atomic-spinner v-if="props.loading && props.value" is-shown />
        <atomic-icon v-else id="check" />
        <atomic-spinner v-if="props.loading && !props.value" is-shown />
        <atomic-icon v-else id="close" />
      </div>
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    value: boolean;
    name: string;
    loading?: boolean;
  }>();
  const emit = defineEmits(['change']);
</script>

<style src="~/assets/styles/components/form/input/toggle.scss" lang="scss" />
