<template>
  <div class="input-search">
    <div class="row">
      <input
        class="field"
        type="text"
        ref="search"
        :placeholder="props.placeholder"
        :value="props.value"
        @input="onInput"
      />
      <atomic-icon id="search"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['update:value', 'input']);
  const onInput = (e:any):void => {
    emit('update:value', e.target.value);
    emit('input', e.target.value);
  };
</script>

<style lang="scss" src="./style.scss"/>
