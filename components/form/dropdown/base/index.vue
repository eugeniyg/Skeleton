<template>
  <div
    class="dropdown"
    :class="classes"
    :tabindex="tabindex"
    @blur="onBlur"
  >
    <span v-if="label" class="label">{{ label }}<sup v-if="isRequired">*</sup></span>

    <div class="selected" @click="open">
      <img v-if="props.value.mask" class="mask" :src="props.value.mask" />
      <template v-if="props.value.value">{{ props.value.value }}</template>
      <span v-else-if="placeholder" class="placeholder">{{ placeholder }}</span>
      <atomic-icon id="ui-arrow_expand-close"/>
    </div>

    <div class="items" v-if="options.length">
      <div
        class="item"
        v-for="(option, i) in options"
        :key="i"
        :class="{'is-selected': option.code === props.value.code }"
        @click="select(option)"
      >
        <img v-if="option.mask" class="mask" :src="option.mask" />
        {{ option.value }}
        <atomic-icon v-if="option.code === props.value.code" id="ui-check"/>
      </div>
    </div>

    <atomic-hint v-if="hint && hint.variant" :variant="hint.variant" :message="hint.message"/>
    <input type="hidden" :name="name" :value="props.value.value" />
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
      type: [String, Object],
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
      validator: (val:string) => ['xs', 'sm', 'md', 'lg', ''].includes(val),
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: Object || null,
    },
  });

  const emit = defineEmits(['input', 'update:value']);

  const isError = computed(() => (props.hint && props.hint.variant === 'error'));

  const isOpen = ref<boolean>(false);

  const classes = computed(() => [
    props.size ? `size-${props.size}` : null,
    { 'is-open': isOpen.value },
    { 'has-error': isError.value },
    { 'is-disabled': props.isDisabled },
  ]);

  const select = (option: any) => {
    emit('input', option);
    emit('update:value', option);
    isOpen.value = false;
  };

  const open = ():void => {
    isOpen.value = !isOpen.value;
  };

  const onBlur = ():void => {
    isOpen.value = false;
  };
</script>

<style lang="scss" src="./style.scss"/>
