<template>
  <label :class="classes">
    <span v-if="props.label" class="label"
      >{{ props.label }}<span v-if="props.isRequired" class="required">*</span></span
    >

    <client-only>
      <input
        v-model="postalValue"
        v-maska="'#########'"
        inputmode="numeric"
        class="field"
        type="text"
        name="postalCode"
        :placeholder="props.placeholder || 'Enter number'"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      />
    </client-only>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
  </label>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label?: string;
    value?: string;
    isDisabled?: boolean;
    isRequired?: boolean;
    placeholder?: string;
    hint?: { variant: string; message: string };
  }>();

  const classes = computed(() => [
    'input-text',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
  ]);

  const postalValue = ref<string>('');
  if (props.value) {
    postalValue.value = props.value;
  }

  const emit = defineEmits(['focus', 'input', 'update:value', 'blur']);
  const onFocus = (): void => {
    emit('focus', postalValue.value);
  };

  const onInput = (): void => {
    emit('update:value', postalValue.value);
    emit('input', postalValue.value);
  };

  const onBlur = (): void => {
    emit('blur', postalValue.value);
  };
</script>

<style src="~/assets/styles/components/form/input/text.scss" lang="scss" />
