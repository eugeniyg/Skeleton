<template>
  <label :class="classes">
    <span v-if="label" class="label">
      {{ label }}<sup v-if="isRequired">*</sup>
    </span>

    <slot name="pills"/>

    <div class="row">
      <input
        class="field"
        type="text"
        inputmode="decimal"
        maxlength="10"
        v-maska
        data-maska="T.T"
        data-maska-tokens="T:[0-9]:multiple"
        :name="name"
        :value="props.value"
        :required="props.isRequired"
        :placeholder="props.placeholder"
        @blur="onBlur"
        @input="onInput"
      />
      <span class="mask" v-if="props.currency">{{ props.currency }}</span>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
  </label>
</template>

<script setup lang="ts">
  import { vMaska } from 'maska';

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: false,
    },
    value: {
      type: [Number, String],
      default: 20,
    },
    min: {
      type: Number,
      default: 20,
    },
    max: {
      type: Number,
      default: 5000,
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
    isBigger: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Number,
      required: true,
    },
  });

  const emit = defineEmits(['blur', 'update:value', 'input']);
  const onInput = (e:any):void => {
    e.target.value = e.target.value.replace(/^0[0-9]/, (match:string) => match.slice(1));
    emit('input', e.target.value);
    emit('update:value', e.target.value);
  };

  const onBlur = (e:any):void => {
    if (!e.target.value || e.target.value < props.min || e.target.value > props.max) {
      e.target.value = props.defaultValue;
      emit('input', e.target.value);
      emit('update:value', e.target.value);
      emit('blur', props.defaultValue);
    } else emit('blur', e.target.value);
  };

  const classes = computed(() => [
    'input-number',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-bigger': props.isBigger },
  ]);
</script>

<style lang="scss">
.input-number {
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
    @include font($heading-2);
    transition: border-color .2s ease-in-out;
    width: 100%;
    padding-right: rem(50px);

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    -moz-appearance: textfield;

    &::placeholder {
      color: var(--gray-400);
    }

    &:focus {
      --border-color: var(--gray-300);
    }
  }

  &.is-bigger {
    .field {
      @include upd-font($heading-7);
    }
  }

  .mask {
    position: absolute;
    right: rem(16px);
    top: 0;
    bottom: 0;
    margin-top: auto;
    margin-bottom: auto;
    @include font($body-2);
    color: var(--color, var(--gray-400));
    display: flex;
    align-items: center;

    .icon {
      --color: var(--gray-400);
    }
  }

  img.mask {
    width: rem(20px);
    height: rem(20px);
  }

  .hint, .pass-progress {
    margin-top: rem(8px);
  }

  &.has-error {
    --border-color: var(--red-800);
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

  &.has-error {
    .icon {
      --color: var(--gray-600);
    }
  }
}
</style>
