<template>
  <label :class="classes">
    <span v-if="props.label" class="label">{{ props.label }}<span class="required" v-if="props.isRequired">*</span></span>

    <client-only>
      <input
        inputmode="numeric"
        v-maska
        data-maska="#########"
        class="field"
        type="text"
        name="postalCode"
        v-model="postalValue"
        :placeholder="props.placeholder"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      />
    </client-only>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  import { vMaska } from 'maska';

  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Enter number',
    },
    hint: {
      type: Object,
      required: false,
    },
  });

  const classes = computed(() => [
    'input-text',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled }
  ]);

  const postalValue = ref<string>('');
  if (props.value) {
    postalValue.value = props.value;
  }

  const emit = defineEmits(['focus', 'input', 'update:value', 'blur']);
  const onFocus = ():void => {
    emit('focus', postalValue.value);
  };

  const onInput = ():void => {
    emit('update:value', postalValue.value);
    emit('input', postalValue.value);
  };

  const onBlur = ():void => {
    emit('blur', postalValue.value);
  };
</script>

<style src="~/assets/styles/components/form/input/text.scss" lang="scss" />

