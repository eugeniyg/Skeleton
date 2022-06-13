<template>
  <div class="input-date">
    <span class="label">{{ props.label }}</span>
    <div class="row">
      <flat-pickr v-model="date" :config="props.settings.config" placeholder="-- / -- / ----"/>
      <atomic-icon class="mask-placeholder" id="ui-calendar"/>
      <atomic-icon class="mask-toggle" id="ui-arrow_expand-close"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import flatPickr from 'vue-flatpickr-component';

  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    settings: {
      type: Object,
      default: () => ({
        date: null,
        config: {
          // wrap: true, // set wrap to true only when using 'input-group'
          // altFormat: 'M j, Y',
          altInput: true,
          dateFormat: 'Y-m-d',
          // mode: 'range',
          monthSelectorType: 'static',
        },
      }),
    },
  });

  const date = ref<string|null>(null);
</script>

<style lang="scss" src="./style.scss"/>
