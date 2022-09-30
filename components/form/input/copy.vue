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
        <atomic-icon id="copy"/>
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

  const classes = computed(() => [
    'input-copy',
    { 'has-error': props.hint?.variant === 'error' },
  ]);

  const emit = defineEmits(['blur', 'input']);
  const copyInput = ref();

  const copy = ():void => {
    copyInput.value.select();
    document.execCommand('copy');
  };

</script>

<style lang="scss">
.input-copy {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  width: 100%;

  @extend %input-label;

  .row {
    position: relative;
    display: flex;
  }

  .field {
    background-color: var(--bg, var(--gray-800));
    padding: var(--input-padding-y, #{rem(11px)}) rem(16px);
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    border-radius: 8px 0 0 8px;
    @include font($body-2);
    transition: border-color .2s ease-in-out;
    flex-grow: 1;
    text-overflow: ellipsis;

    &::placeholder {
      color: var(--gray-400);
    }

    &:focus {
      --border-color: var(--gray-300);
    }
  }

  .hint {
    margin-top: rem(8px);
  }

  &.has-error {
    --border-color: var(--red-800);
  }

  .btn-copy {
    @extend %skip-btn;
    background: var(--bg, var(--gradient-radial));
    border-radius: 0 8px 8px 0;
    padding: rem(8px);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: pointer;
      --bg: var(--gradient-radial-hover);
    }

    &:focus, &:active {
      --bg: var(--gradient-radial-focus);
    }
  }

  .icon {
    --color: var(--white);
  }
}
</style>
