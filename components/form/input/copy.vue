<template>
  <label :class="classes" :for="props.name">
    <span v-if="props.label" class="label">
      {{ label }}<span class="required" v-if="props.isRequired">*</span>
    </span>

    <div class="row">
      <input
        class="field"
        readonly
        ref="copyInput"
        :value="props.value"
        :id="props.name"
        :name="props.name"
        :required="props.isRequired"
        :placeholder="props.placeholder"
        @blur="emit('blur')"
        @input="emit('input')"
      />

      <button class="btn-copy" @click.prevent="copyValue">
        <atomic-icon id="copy"/>
      </button>
    </div>

    <atomic-hint v-if="props.hint" v-bind="hint"/>
  </label>
</template>

<script setup lang="ts">
  import copy from "copy-to-clipboard";

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: ' ',
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
  });

  const classes = computed(() => [
    'input-copy',
    { 'has-error': props.hint?.variant === 'error' },
  ]);

  const emit = defineEmits(['blur', 'input']);
  const copyInput = ref();

  const copyValue = (): void => {
    copyInput.value.select();
    copy(props.value || '');
  };

</script>

<style src="~/assets/styles/components/form/input/copy.scss" lang="scss" />

