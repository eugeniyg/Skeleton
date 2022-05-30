<template>
  <div class="input-gender">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <form-input-radio
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      value="Male"
      id="Male"
      :isChecked="props.value === 'Male'"
      @change="changeValue('Male')"
    >
      Male<atomic-icon id="ui-male"/>
    </form-input-radio>

    <form-input-radio
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      value="Female"
      id="Female"
      :isChecked="props.value === 'Female'"
      @change="changeValue('Female')"
    >
      Female<atomic-icon id="ui-female"/>
    </form-input-radio>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    hint: {
      type: Object,
      required: false,
    },
  });
  const emit = defineEmits(['update:value']);
  const changeValue = (value:string):void => {
    emit('update:value', value);
  };
</script>

<style lang="scss" src="./style.scss"/>
