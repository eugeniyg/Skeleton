<template>
  <div class="input-lottery-radio" :class="{ 'is-checked': !!props.value, 'is-disabled': props.isDisabled }">
    <label class="input-lottery-radio__label">
      <input
        class="input-lottery-radio__input"
        type="radio"
        :name="props.name"
        :disabled="props.isDisabled"
        :checked="!!props.value"
        @change="onChange"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id: string;
    isDisabled?: boolean;
    name: string;
    value: any;
  }>();

  const emit = defineEmits(['change', 'update:value']);
  const onChange = (e: any): void => {
    emit('change', e.target.checked);
    emit('update:value', e.target.checked ? 1 : '');
  };
</script>

<style src="~/assets/styles/components/form/input/lottery-radio.scss" lang="scss" />
