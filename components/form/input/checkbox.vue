<template>
  <div class="input-checkbox" :class="{'has-error': props.isError, 'input-checkbox--checked': !!props.value }">
    <label class="label">
      <input
        class="checkbox"
        type="checkbox"
        :name="props.name"
        :disabled="props.isDisabled"
        :checked="!!props.value"
        @change="onChange"
      />
      
      <atomic-icon :id="props.icon || 'check'"/>
      
      <p>
        <span v-html="label"/>
        <sup v-if="isRequired"> *</sup>
      </p>
    </label>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    isDisabled?: boolean,
    isRequired?: boolean,
    isError?: any,
    label?: string,
    name: string,
    value: any,
    icon?: string|undefined;
  }>();

  const emit = defineEmits(['change', 'update:value']);
  const onChange = (e:any):void => {
    emit('change', e.target.checked);
    emit('update:value', e.target.checked ? 1 : '');
  };
</script>

<style src="~/assets/styles/components/form/input/checkbox.scss" lang="scss" />

