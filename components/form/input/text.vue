<template>
  <label :class="classes">
    <span v-if="props.label" class="label">{{ props.label }}<span class="required" v-if="props.isRequired">*</span></span>

    <input
      class="field"
      :inputmode="props.inputmode"
      :type="props.type"
      :name="props.name"
      :value="props.value"
      :readonly="props.isDisabled"
      :required="props.isRequired"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
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
      type: String
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
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
    autocomplete: {
      type: String,
      default: 'on',
    },
    inputmode: {
      type: String,
      default: 'text'
    }
  });
  const emit = defineEmits(['blur', 'focus', 'input', 'update:value', 'submit']);

  const classes = computed(() => [
    'input-text',
    { 'has-error': props.hint?.variant === 'error' },
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

<style src="~/assets/styles/components/form/input/text.scss" lang="scss" />

