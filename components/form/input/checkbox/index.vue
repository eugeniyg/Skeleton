<template>
  <div class="input-checkbox" :class="{'has-error': props.isError}">
    <input
      class="checkbox"
      type="checkbox"
      :name="props.name"
      :disabled="props.isDisabled"
      :id="props.name"
      :value="checked"
      v-model="checked"
    />

    <label class="label" :for="props.name">
      <atomic-icon id="ui-check"/>
      <slot/>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    isChecked: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
  });

  const checked = ref<boolean>(props.isChecked);
</script>

<style lang="scss" src="./style.scss"/>
