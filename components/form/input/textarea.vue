<template>
  <label :class="classes">
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <textarea
      class="field"
      :value="props.value"
      :name="props.name"
      :placeholder="props.placeholder || ''"
      :required="props.isRequired"
      rows="6"
      cols="50"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isRequired?: boolean;
    value?: string;
    name: string;
    label?: string;
    placeholder?: string;
    hint?: { variant: string; message: string };
  }>();

  const emit = defineEmits(['input', 'blur', 'focus', 'update:value']);

  const classes = computed(() => [
    'input-textarea',
    { 'has-error': props.hint?.variant === 'error' },
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

<style src="~/assets/styles/components/form/input/textarea.scss" lang="scss" />

