<template>
  <label :class="classes">
    <span v-if="props.label" class="label">{{ props.label }}<sup v-if="props.isRequired">*</sup></span>

    <input
      class="field"
      :type="props.type"
      :name="props.name"
      :value="props.value"
      :readonly="props.isDisabled"
      :required="props.isRequired ? 'required': false"
      :placeholder="props.placeholder"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keyup.enter="emit('submit', $event)"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  const props = defineProps({
    type: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: ' ',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: Object,
      required: false,
    },
  });
  const emit = defineEmits(['blur', 'focus', 'input', 'update:value', 'submit']);

  const isError = computed(() => props.hint && props.hint.variant === 'error');

  const classes = computed(() => [
    'input-text',
    { 'has-error': isError.value },
    { 'is-disabled': props.isDisabled },
    { 'is-hidden': props.type === 'hidden' },
  ]);

  const onBlur = (e:any) => {
    emit('blur', e.target.value);
  };
  const onFocus = (e:any) => {
    emit('focus', e.target.value);
  };

  const onInput = (e:any) => {
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };
</script>

<style lang="scss" src="./style.scss"/>
