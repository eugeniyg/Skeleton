<template>
  <label :class="classes" :for="props.name">
    <span v-if="props.label" class="label">
      {{ label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <div class="row">
      <input
        class="field"
        readonly=""
        ref="copyInput"
        :value="props.value"
        :id="props.name"
        :name="props.name"
        :required="props.isRequired ? 'required': false"
        :placeholder="props.placeholder"
        @blur="emit('blur')"
        @input="emit('input')"
      />

      <button class="btn-copy" @click.prevent="copy">
        <atomic-icon id="ui-copy"/>
      </button>
    </div>

    <atomic-hint v-if="props.hint" v-bind="hint"/>
  </label>
</template>

<script setup lang="ts">
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

  const isError = computed(() => props.hint && props.hint.variant === 'error');
  const classes = computed(() => [
    'input-copy',
    { 'has-error': isError.value },
  ]);

  const emit = defineEmits(['blur', 'input']);
  const copyInput = ref();

  const copy = ():void => {
    copyInput.value.select();
    document.execCommand('copy');
  };

</script>

<style lang="scss" src="./style.scss"/>
