<template>
  <div class="input-gender">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <form-input-radio
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      id="male"
      value="male"
    >
      Male<atomic-icon id="ui-male"/>
    </form-input-radio>

    <form-input-radio
      type="radio"
      name="gender-select"
      :is-disabled="props.isDisabled"
      id="female"
      value="female"
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
</script>

<style lang="scss" src="./style.scss"/>
