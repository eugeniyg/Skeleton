<template>
  <div class="input-checkbox" :class="{'has-error': props.isError}">
    <input
      class="checkbox"
      type="checkbox"
      :name="props.name"
      :disabled="props.isDisabled"
      :id="props.name"
      :checked="!!props.value"
      @change="onChange"
    />

    <label class="label" :for="props.name">
      <atomic-icon id="ui-check"/>
      <slot/>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
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
    value: {
      type: [String, Boolean],
      default: '',
    },
  });

  const emit = defineEmits(['input', 'update:value']);
  const onChange = (e:any):void => {
    emit('input', e.target.checked);
    emit('update:value', e.target.checked);
  };
</script>

<style lang="scss" src="./style.scss"/>
