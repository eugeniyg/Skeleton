<template>
  <label :class="classes">
    <span v-if="props.label" class="label"
      >{{ props.label }}<span v-if="props.isRequired" class="required">*</span></span
    >

    <input
      ref="inputRef"
      class="field"
      :inputmode="props.inputmode || 'text'"
      :type="props.type || 'text'"
      :name="props.name"
      :value="props.value"
      :readonly="props.isDisabled"
      :required="props.isRequired"
      :placeholder="props.placeholder || ''"
      :autocomplete="props.autocomplete || 'on'"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keyup.enter="emit('submit', $event)"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
  </label>
</template>

<script setup lang="ts">
  const props = defineProps<{
    type?: string;
    name: string;
    value?: string;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    hint?: { variant: string; message: string };
    autocomplete?: string;
    inputmode?: 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  }>();
  const emit = defineEmits(['blur', 'focus', 'input', 'update:value', 'submit']);

  const classes = computed(() => [
    'input-text',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
    { 'is-hidden': props.type === 'hidden' },
  ]);

  const onBlur = (e: any) => {
    emit('blur', e.target.value);
  };
  const onFocus = (e: any) => {
    emit('focus', e.target.value);
  };

  const onInput = (e: any) => {
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };

  const inputRef = ref();

  const focusField = (): void => {
    inputRef.value.focus();
  };

  defineExpose({
    focusField,
  });
</script>

<style src="~/assets/styles/components/form/input/text.scss" lang="scss" />
