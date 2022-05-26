<template>
  <div class="input-radio" :class="{ 'has-error': props.isError, 'is-disabled': props.isDisabled }">
    <input
      class="radio"
      type="radio"
      :name="props.name"
      :disabled="props.isDisabled"
      :id="props.id"
      :checked="props.isChecked"
    />

    <label class="label" :for="props.id">
      <atomic-icon id="radio"/>
      <slot/>
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
</script>

<style lang="scss" src="./style.scss"/>
