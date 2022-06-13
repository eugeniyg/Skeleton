<template>
  <div
    class="input-payments"
    :class="classes"
    :tabindex="props.tabindex"
    @blur="onBlur"
  >
    <span v-if="props.label" class="label">
      {{ props.label }}<sup v-if="props.isRequired">*</sup>
    </span>

    <div class="selected" @click="open">
      <img v-if="selected.mask" class="mask" :src="selected.mask" />
      <span v-else-if="props.placeholder" class="placeholder">{{ props.placeholder }}</span>
      <atomic-icon id="ui-arrow_expand-close"/>
    </div>

    <div class="items" v-if="props.options.length">
      <div
        class="item"
        v-for="(option, i) in props.options"
        :key="i"
        :class="{'is-selected': option.value === selected.value }"
        @click="select(option)"
      >
        <img v-if="option.mask" class="mask" :src="option.mask" />
      </div>
    </div>

    <atomic-hint v-if="props.hint && props.hint.variant" :variant="props.hint.variant" :message="props.hint.message"/>

    <input type="hidden" :name="name" :value="selected.value" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    options: {
      type: Array,
      required: true,
      default: () => [],
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
    default: {
      type: Object,
      required: false,
    },
    hint: {
      type: Object,
      required: false,
    },
  });

  const emit = defineEmits(['input', 'has-error']);
  const selected = ref<any>({ value: props.default ? props.default.value : null });
  const isOpen = ref<boolean>(false);

  const isError = computed(() => (props.hint && props.hint.variant === 'error'));
  const classes = computed(() => [
    props.size ? `size-${props.size}` : null,
    { 'is-open': isOpen.value },
    { 'has-error': isError.value },
    { 'is-disabled': props.isDisabled },
  ]);

  const select = (option:any):void => {
    emit('input', option);
    isOpen.value = false;
    selected.value = option;
  };

  const open = ():void => {
    isOpen.value = !isOpen.value;
  };

  const onBlur = ():void => {
    isOpen.value = false;
  };
</script>

<style lang="scss" src="./style.scss"/>
