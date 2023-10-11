<template>
  <label :class="classes">
    <span v-if="label" class="label">
      {{ label }}<span class="required" v-if="isRequired">*</span>
    </span>

    <slot name="pills"/>

    <div class="row">
      <input
        class="field"
        type="text"
        inputmode="decimal"
        maxlength="10"
        v-maska
        data-maska="T.T"
        data-maska-tokens="T:[0-9]:multiple"
        :name="name"
        :value="props.value"
        :required="props.isRequired"
        :placeholder="props.placeholder"
        @blur="onBlur"
        @input="onInput"
      />
      <span class="mask" v-if="props.currency">{{ props.currency }}</span>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  import { vMaska } from 'maska';

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: false,
    },
    value: {
      type: [Number, String],
      default: 20,
    },
    min: {
      type: Number,
      default: 20,
    },
    max: {
      type: Number,
      default: 5000,
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
    hint: {
      type: Object,
      required: false,
    },
    isBigger: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['blur', 'update:value', 'input']);
  const onInput = (e:any):void => {
    e.target.value = e.target.value.replace(/^0[0-9]/, (match:string) => match.slice(1));
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };

  const onBlur = (e:any):void => {
    if (!e.target.value || e.target.value < props.min || e.target.value > props.max) {
      e.target.value = props.defaultValue;
      emit('input', e.target.value);
      emit('update:value', e.target.value);
      emit('blur', props.defaultValue);
    } else emit('blur', e.target.value);
  };

  const classes = computed(() => [
    'input-number',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-bigger': props.isBigger },
  ]);
</script>

<style src="~/assets/styles/components/form/input/number.scss" lang="scss" />

