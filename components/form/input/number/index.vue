<template>
  <label :class="classes" :for="name">
    <span v-if="label" class="label">
      {{ label }}<sup v-if="isRequired">*</sup>
    </span>

    <slot name="pills"/>

    <div class="row">
      <input
        class="field"
        type="number"
        :id="props.name"
        :name="name"
        :min="props.min"
        :max="props.max"
        :value="props.value"
        :required="props.isRequired ? 'required': false"
        :placeholder="props.placeholder"
        @blur="emit('blur')"
        @input="emit('input')"
      />
      <span class="mask" v-if="props.mask.type ==='text'">{{ props.mask.value }}</span>
      <span class="mask" v-if="props.mask.type ==='icon'">
        <atomic-icon :id="props.mask.value"/>
      </span>

      <img class="mask" v-if="props.mask.type === 'img'" :src="props.mask.value" />
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
    value: {
      type: Number,
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
    mask: {
      type: Object,
      default: () => (
        {
          type: 'text', // text, icon, img
          value: 'EUR',
        }
      ),
    },
    isBigger: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['blur', 'input']);

  const isError = computed(() => props.hint && props.hint.variant === 'error');
  const classes = computed(() => [
    'input-number',
    { 'has-error': isError.value },
    { 'is-bigger': props.isBigger },
  ]);
</script>

<style lang="scss" src="./style.scss"/>
