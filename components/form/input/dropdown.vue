<template>
  <div
    ref="drop"
    class="dropdown"
    :class="classes"
    :tabindex="props.tabindex"
    @blur="onBlur"
  >
    <span v-if="props.label" class="label">{{ props.label }}<sup v-if="props.isRequired">*</sup></span>

    <div class="selected" @click="open">
      <img v-if="valueObject.mask" class="mask" :src="valueObject.mask" />
      <span v-if="valueObject.value">{{ valueObject.value }}</span>
      <span v-else-if="props.placeholder" class="placeholder">{{ props.placeholder }}</span>
      <atomic-icon id="arrow_expand-close"/>
    </div>

    <div ref="dropItems" class="items" v-if="props.options.length">
      <div
        class="item"
        v-for="(option, i) in props.options"
        :key="i"
        :class="{'is-selected': option.code === valueObject.code }"
        @click="select(option)"
      >
        <img v-if="option.mask" class="mask" :src="option.mask"/>
        <span>{{ option.value }}</span>
        <atomic-icon v-if="option.code === valueObject.code" id="check"/>
      </div>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
    <input type="hidden" :name="props.name" :value="props.value" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    options: {
      type: Array,
      required: true,
      default: () => ([]),
    },
    value: {
      type: [String, Object, Number],
      required: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Dropdown placeholder',
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      validator: (val: string) => ['xs', 'sm', 'md', 'lg', ''].includes(val),
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: Object,
      required: false,
    },
    isFitContent: {
      type: Boolean,
    },
  });

  const valueObject = ref<any>('');

  if (props.value) {
    valueObject.value = props.options.find((option:any) => option.code === props.value) || {};
  }

  const emit = defineEmits(['input', 'focus', 'update:value']);

  const isOpen = ref<boolean>(false);
  const drop = ref<HTMLElement>();
  const dropItems = ref<HTMLElement>();

  const classes = computed(() => [
    props.size ? `size-${props.size}` : null,
    { 'is-open': isOpen.value },
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
    { 'is-fit-content': props.isFitContent },
  ]);

  const select = (option: any) => {
    if (option.code !== props.value) {
      emit('update:value', option.code);
      emit('input', option.code);
    }
    isOpen.value = false;
  };

  watch(() => props.value, (newValue:any) => {
    valueObject.value = props.options.find((option:any) => option.code === newValue) || '';
  });

  const open = ():void => {
    if (props.isDisabled) return;
    isOpen.value = !isOpen.value;
    emit('focus');
  };

  const onBlur = ():void => {
    isOpen.value = false;
  };

  onMounted(() => {
    if (props.isFitContent && drop.value) {
      drop.value.style.width = `${dropItems.value?.offsetWidth}px`;
    }
  });
</script>

<style lang="scss">
.dropdown {
  position: relative;
  width: var(--select-width, 100%);
  outline: none;
  @include font($body-2);

  &.is-fit-content {
    .items {
      max-width: none;
      width: auto;

      span {
        overflow: unset;
      }
    }
  }

  .icon {
    color: var(--icon-color, var(--gray-400));
    transform: var(--icon-transform, rotate(0));
    transition: transform .2s ease-in-out;
  }

  .selected {
    border-radius: 12px;
    border: 1px solid var(--border-color, var(--gray-800));
    color: var(--color, var(--white));
    cursor: pointer;
    user-select: none;
    padding: var(--select-padding-y, rem(8px) rem(36px) rem(8px) rem(16px));
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr;
    align-items: center;
    background-color: var(--bg, var(--gray-800));
    position: relative;
    transition: border-color .2s ease-in-out;
    min-height: rem(42px);
    grid-column-gap: rem(8px);

    .filters & {
      @include font($body-1);
      min-height: unset;
    }

    .icon {
      position: absolute;
      top: 0;
      bottom: 0;
      right: rem(8px);
      margin-top: auto;
      margin-bottom: auto;

    }

    span {
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .placeholder {
    color: var(--color, var(--gray-400));
  }

  .label {
    color: var(--white);
    margin-bottom: rem(8px);
    display: block;
  }

  .items {
    position: absolute;
    left: 0;
    max-width: 100%;
    width: 100%;
    padding: rem(8px);
    visibility: var(--items-visibility, hidden);
    max-height: calc((#{rem(38px)} * 4) + #{8px});
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--gray-800);
    transform: translateY(#{rem(8px)});
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 12px;

    @extend %scrollbar;
  }

  .item {
    color: var(--color, var(--white));
    padding: rem(8px);
    cursor: pointer;
    user-select: none;
    background-color: var(--bg, transparent);
    transition: background-color .2s ease-in-out;
    position: relative;
    align-items: center;
    grid-column-gap: rem(8px);
    text-overflow: ellipsis;
    white-space: nowrap;

    display: grid;
    grid-auto-flow: column;
    grid-template-columns: auto 1fr;

    .filters & {
      @include font($body-1);
    }

    span {
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .icon {
      margin-left: auto;
      position: relative;
      transform: var(--icon-transform, (rotate(0) translateX(#{rem(8px)})));
      transition: transform .2s ease-in-out;
      --icon-color: var(--white);
    }

    &:hover {
      border-radius: 4px;
      --bg: var(--gray-700);
    }
  }

  .mask {
    width: rem(22px);
    height: rem(18px);
  }

  .hint {
    margin-top: rem(6px);
  }

  &.is-open {
    z-index: 2;

    .selected {
      --border-color: var(--gray-300);
      --color: var(--white);
      --bg: var(--gray-700);
      --icon-transform: rotate(180deg);
    }

    --items-visibility: visible;
  }

  &.has-error {
    --border-color: var(--red-800);

    .selected {
      --color: var(--white);
      --icon-color: var(--red-500);
      --border-color: var(--red-800) !important;
    }
  }

  &.is-disabled {
    pointer-events: none;

    .selected {
      --border-color: var(--gray-800);
      --color: var(--gray-500);
      --bg: var(--gray-800);
      --icon-transform: rotate(0deg);
    }

    .placeholder {
      --color: var(--gray-500);
    }

    --icon-color: var(--gray-500);
  }

  &.size-xs {
    --select-padding-y: #{rem(4px)};
    @include upd-font($body-1);
  }

  &.size-sm {
    --select-padding-y: #{rem(8px)};
    @include upd-font($body-1);
  }

  &.size-md {
    --select-padding-y: #{rem(11px)};
    @include upd-font($body-2);
  }

  &.size-lg {
    --select-padding-y: #{rem(19px)};
    @include upd-font($body-2);
  }
}
</style>
