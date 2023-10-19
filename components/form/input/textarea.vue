<template>
  <label :class="classes">
    <span class="label" v-if="props.label">
      {{ props.label }}<span class="required" v-if="props.isRequired">*</span>
    </span>

    <textarea
      class="field"
      :value="props.value"
      :name="props.name"
      :placeholder="props.placeholder"
      :required="props.isRequired ? 'required': false"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      rows="6"
      cols="50"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  const props = defineProps({
    isRequired: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String
    },
    placeholder: {
      type: String
    },
    hint: {
      type: Object,
      required: false,
    },
  });

  const emit = defineEmits(['input', 'blur', 'focus', 'update:value']);

  const classes = computed(() => [
    'input-textarea',
    { 'has-error': props.hint?.variant === 'error' },
  ]);

  const onBlur = (e:any) => {
    emit('blur', e.target.value);
  };
  const onFocus = (e:any) => {
    emit('focus', e.target.value);
  };

  const onInput = (e:any) => {
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };
</script>

<style src="~/assets/styles/components/form/input/textarea.scss" lang="scss" />

