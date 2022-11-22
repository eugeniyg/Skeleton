<template>
  <label :class="classes">
    <span v-if="props.label" class="label">{{ props.label }}<sup v-if="props.isRequired">*</sup></span>

    <input
      class="field"
      :type="props.type"
      :name="props.name"
      :value="props.value"
      :readonly="props.isDisabled"
      :required="props.isRequired ? 'required': false"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @keyup.enter="emit('submit', $event)"
    />

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  const props = defineProps({
    type: {
      type: String,
      default: 'text',
    },
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
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: Object,
      required: false,
    },
    autocomplete: {
      type: String,
      default: 'on',
    },
  });
  const emit = defineEmits(['blur', 'focus', 'input', 'update:value', 'submit']);

  const classes = computed(() => [
    'input-text',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
    { 'is-hidden': props.type === 'hidden' },
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
.input-text {
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
    border-radius: 12px;
    @include font($body-2);
    transition: border-color .2s ease-in-out;
    @extend %inputMask;
    font-family: 'NeoSansPro', sans-serif;

    &::placeholder {
      color: var(--gray-400);
    }

    &:focus {
      --border-color: var(--gray-300);
    }
  }

  .hint, .pass-progress {
    margin-top: rem(6px);
  }

  &.has-error {
    --border-color: var(--red-800);
  }

  &.is-disabled {
    pointer-events: none;

    .field {
      --border-color: var(--gray-800);
      --color: var(--gray-500);
      --bg: var(--gray-800);
      --icon-transform: rotate(0deg);
    }

    .placeholder {
      --color: var(--gray-500);
    }
  }

  &.is-hidden {
    display: none !important;
  }

  &.size-xs {
    --input-padding-y: #{rem(4px)};
    @include upd-font($body-1);
  }

  &.size-sm {
    --input-padding-y: #{rem(8px)};
    @include upd-font($body-1);
  }

  &.size-md {
    --input-padding-y: #{rem(11px)};
    @include upd-font($body-2);
  }
}
</style>
