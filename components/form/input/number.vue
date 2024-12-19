<template>
  <label :class="classes">
    <span v-if="label" class="label"> {{ label }}<span v-if="props.isRequired" class="required">*</span> </span>

    <slot name="pills" />

    <div class="row">
      <input
        v-maska="'T.T'"
        class="field"
        type="text"
        inputmode="decimal"
        maxlength="10"
        data-maska-tokens="T:[0-9]:multiple"
        :name="name"
        :value="props.value"
        :required="props.isRequired"
        :placeholder="props.placeholder || ''"
        @blur="onBlur"
        @input="onInput"
      />
      <span v-if="props.currency" class="mask">{{ props.currency }}</span>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
  </label>
</template>

<script setup lang="ts">
  const props = defineProps<{
    name: string;
    currency?: string;
    value: string | number;
    min: number;
    max: number;
    label: string;
    placeholder?: string;
    isRequired?: boolean;
    hint?: { variant: string; message: string };
    isBigger?: boolean;
  }>();

  const emit = defineEmits(['blur', 'update:value', 'input']);
  const onInput = (e: any): void => {
    e.target.value = e.target.value.replace(/^0[0-9]/, (match: string) => match.slice(1));
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };

  const onBlur = (e: any): void => {
    if (!e.target.value || e.target.value < props.min) {
      e.target.value = props.min;
      emit('input', e.target.value);
      emit('update:value', e.target.value);
      emit('blur', e.target.value);
    } else if (e.target.value > props.max) {
      e.target.value = props.max;
      emit('input', e.target.value);
      emit('update:value', e.target.value);
      emit('blur', e.target.value);
    } else emit('blur', e.target.value);
  };

  const classes = computed(() => [
    'input-number',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-bigger': props.isBigger },
  ]);
</script>

<style src="~/assets/styles/components/form/input/number.scss" lang="scss" />
