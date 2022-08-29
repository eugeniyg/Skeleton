<template>
  <div class="input-toggle" :class="{ 'input-toggle--checked': props.value }">
    <label class="label">
      <input
        class="checkbox"
        type="checkbox"
        :name="props.name"
        :checked="props.value"
        @change="emit('change')"
      />

      <div class="slider">
        <atomic-icon id="check"/>
        <atomic-icon id="close"/>
      </div>
      <slot/>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    value: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(['change']);
</script>

<style lang="scss" src="./style.scss"/>
