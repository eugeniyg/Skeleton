<template>
  <label :class="classes">
    <span class="label" v-if="props.label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <textarea
      class="field"
      :name="props.name"
      :placeholder="props.placeholder"
      :required="props.isRequired ? 'required': false"
      rows="6"
      cols="50"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  const props = defineProps({
    isRequired: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    hint: {
      type: Object,
      required: false,
    },
  });

  const isError = computed(() => props.hint && props.hint.variant === 'error');
  const classes = computed(() => [
    'input-textarea',
    { 'has-error': isError.value },
  ]);
</script>

<style lang="scss" src="./style.scss"/>
