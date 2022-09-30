<template>
  <label :class="classes">
    <span class="label" v-if="props.label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
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
      type: String,
      default: ' ',
    },
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
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

<style lang="scss">
.input-textarea {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  width: 100%;

  @extend %input-label;

  .row {
    position: relative;
  }

  .field {
    background-color: var(--bg, var(--gray-800));
    padding: var(--input-padding-y, #{rem(11px)}) rem(16px);
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    border-radius: 8px;
    @include font($body-2);
    transition: border-color .2s ease-in-out;
    width: 100%;
    resize: none;
    font-family: inherit;

    &::placeholder {
      color: var(--gray-400);
      @include font($body-2);
    }

    &:focus {
      --border-color: var(--gray-300);
    }
  }

  .hint, .pass-progress {
    margin-top: rem(4px);
  }

  &.has-error {
    --border-color: var(--red-800);
  }
}
</style>
