<template>
  <label :class="classes">
    <span v-if="label" class="label">{{ label }}<span v-if="props.isRequired" class="required">*</span></span>
    
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
    
    <wallet-warning :content="warningContent" />
    
  </label>
</template>

<script setup lang="ts">
  import type { IWalletModal } from '~/types';
  
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
  
  const walletContent: Maybe<IWalletModal> = inject('walletContent');
  const defaultLocaleWalletContent: Maybe<IWalletModal> = inject('defaultLocaleWalletContent');
  const { getContent } = useProjectMethods();
  
  const emit = defineEmits(['blur', 'focus', 'input', 'update:value', 'submit']);
  
  const classes = computed(() => [
    'input-text',
    'input-destination-tag',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
    { 'is-hidden': props.type === 'hidden' },
  ]);
  
  const warningContent = computed(() => ({
    description: getContent(walletContent, defaultLocaleWalletContent, 'withdraw.destinationTag.warning'),
  }));
  
  const label = computed(() => {
    return  getContent(walletContent, defaultLocaleWalletContent, 'withdraw.destinationTag.label') || props.label;
  });
  
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

