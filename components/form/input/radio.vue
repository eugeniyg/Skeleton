<template>
  <div class="input-radio" :class="{ 'has-error': props.isError, 'is-disabled': props.isDisabled }">
    <input
      :id="props.id"
      class="radio"
      type="radio"
      :name="props.name"
      :disabled="props.isDisabled"
      :checked="props.isChecked"
      @change="emit('change')"
    />

    <label class="label" :for="props.id">
      <atomic-icon id="radio" />
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isChecked: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(['change']);
</script>

<style src="~/assets/styles/components/form/input/radio.scss" lang="scss" />
