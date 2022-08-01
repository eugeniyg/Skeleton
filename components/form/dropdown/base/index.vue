<template>
  <div
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
      <atomic-icon id="ui-arrow_expand-close"/>
    </div>

    <div class="items" v-if="props.options.length">
      <div
        class="item"
        v-for="(option, i) in props.options"
        :key="i"
        :class="{'is-selected': option.code === valueObject.code }"
        @click="select(option)"
      >
        <img v-if="option.mask" class="mask" :src="option.mask" />
        <span>{{ option.value }}</span>
        <atomic-icon v-if="option.code === valueObject.code" id="ui-check"/>
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
      validator: (val:string) => ['xs', 'sm', 'md', 'lg', ''].includes(val),
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
  });

  const valueObject = ref<any>('');

  if (props.value) {
    valueObject.value = props.options.find((option:any) => option.code === props.value) || {};
  }

  const emit = defineEmits(['input', 'focus', 'update:value']);

  const isOpen = ref<boolean>(false);

  const classes = computed(() => [
    props.size ? `size-${props.size}` : null,
    { 'is-open': isOpen.value },
    { 'has-error': props.hint?.variant === 'error' },
    { 'is-disabled': props.isDisabled },
  ]);

  const select = (option: any) => {
    if (option.code !== props.value) {
      emit('update:value', option.code);
      emit('input', option.code);
    }
    isOpen.value = false;
  };

  watch(() => props.value, (newValue:string) => {
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
</script>

<style lang="scss" src="./style.scss"/>
