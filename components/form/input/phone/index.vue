<template>
  <div class="input-phone">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>
    <form-dropdown-base :options="props.items" placeholder="Select code" name="mobile-phone-code"/>
    <form-input-text name="mobile-phone-number" :placeholder="props.placeholder"/>
    <atomic-hint v-bind="props.hint"/>
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
    placeholder: {
      type: String,
      default: 'Enter number',
    },
    items: {
      type: Array,
      default: () => [
        {
          title: '+380',
          value: '+380',
          mask: '/img/flags/us.svg',
        },
        {
          title: '+197',
          value: '+197',
          mask: '/img/flags/us.svg',
        },
      ],
    },
    hint: {
      type: Object,
      required: false,
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
