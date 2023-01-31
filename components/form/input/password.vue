<template>
  <label :class="classes">
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <div class="row">
      <input
        class="field"
        :type="type"
        :readonly="props.isDisabled"
        :name="props.name"
        :required="props.isRequired ? 'required': false"
        :placeholder="props.placeholder"
        :value="props.value"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keyup.enter="emit('submit', $event)"
      />
      <button-toggle-type @change-type="changeType"/>
    </div>

    <atomic-pass-progress v-if="props.showPassProgress" :target="progressTarget"/>
    <atomic-hint v-if="props.hint" v-bind="props.hint"/>
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
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: Object,
      required: false,
    },
    showPassProgress: {
      type: Boolean,
      default: false,
    },
  });

  const classes = computed(() => [
    'input-password',
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
  ]);

  const emit = defineEmits(['blur', 'focus', 'input', 'update:value', 'submit']);
  const onBlur = (e: any):void => {
    emit('blur', e.target.value);
  };
  const onFocus = (e: any):void => {
    emit('focus', e.target.value);
  };

  const progressTarget = ref<string>('');
  const checkPassProgress = (e:any) => {
    const { length } = e.target.value;

    if (length <= 2 && length > 0) {
      progressTarget.value = 'weak';
    } else if (length <= 4 && length > 0) {
      progressTarget.value = 'good';
    } else if (length > 4 && length > 0) {
      progressTarget.value = 'strong';
    } else {
      progressTarget.value = '';
    }
  };

  const onInput = (e:any):void => {
    emit('input', e.target.value);
    emit('update:value', e.target.value);
    checkPassProgress(e);
  };

  const type = ref<string>('password');
  const changeType = (data:string):void => {
    type.value = data;
  };
</script>

<style lang="scss">
.input-password {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  width: 100%;

  @extend %input-label;

  .row {
    position: relative;
    display: flex;
    align-items: center;
  }

  .field {
    background-color: var(--bg, var(--gray-800));
    padding: var(--input-padding-y, #{rem(11px)}) rem(44px) var(--input-padding-y, #{rem(11px)}) rem(16px);
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    border-radius: 12px;
    @include font($body-2);
    transition: border-color .2s ease-in-out;
    width: 100%;
    @extend %inputMask;
    font-family: 'Rubik', sans-serif;

    &::placeholder {
      color: var(--gray-400);
    }

    &:focus {
      --border-color: var(--gray-300);
    }

    &::-ms-reveal {
      display: none !important;
    }
  }

  .hint, .pass-progress {
    margin-top: rem(6px);
  }

  &.has-error {
    --border-color: var(--red-800);
    .icon {
      --color: var(--red-800)
    }
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
