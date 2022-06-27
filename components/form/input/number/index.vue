<template>
  <label :class="classes">
    <span v-if="label" class="label">
      {{ label }}<sup v-if="isRequired">*</sup>
    </span>

    <slot name="pills"/>

    <div class="row">
      <input
        class="field"
        type="number"
        :name="name"
        :value="props.value"
        :required="props.isRequired"
        :placeholder="props.placeholder"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
      />
      <span class="mask" v-if="props.currency">{{ props.currency }}</span>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
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
  });

  const emit = defineEmits(['blur', 'update:value', 'input']);
  const onInput = (e:any):void => {
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };

  const onBlur = (e:any):void => {
    emit('blur', e.target.value);
  };

  const onKeyDown = (e:any):void => {
    if (String(props.value).length > 9 && /[0-9.,]/.test(e.key)) e.preventDefault();
  };

  const isError = computed(() => props.hint && props.hint.variant === 'error');
  const classes = computed(() => [
    'input-number',
    { 'has-error': isError.value },
    { 'is-bigger': props.isBigger },
  ]);
</script>

<style lang="scss" src="./style.scss"/>
