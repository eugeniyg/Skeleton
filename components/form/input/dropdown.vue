<template>
  <div ref="drop" v-click-outside="onBlur" class="dropdown" :class="classes" :tabindex="props.tabIndex ?? 0">
    <span v-if="props.label" class="label">
      {{ props.label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <div class="selected" @click="open">
      <atomic-image
        v-if="valueObject.mask"
        class="mask"
        :src="valueObject.mask"
        :default-image="valueObject.defaultMask"
      />
      <span v-if="valueObject.value">{{ valueObject.value }}</span>
      <span v-else-if="props.placeholder" class="placeholder">{{ props.placeholder }}</span>
      <atomic-icon id="arrow-expand-close" />
    </div>

    <div v-if="props.options.length" ref="dropItems" class="items">
      <div
        v-for="(option, i) in props.options"
        :key="i"
        class="item"
        :class="[{ 'is-selected': option.code === valueObject.code }, { 'disabled-option': option.disabled }]"
        @click="select(option)"
      >
        <atomic-image v-if="option.mask" class="mask" :src="option.mask" :default-image="option.defaultMask" />
        <span>{{ option.value }}</span>
        <atomic-icon v-if="option.code === valueObject.code" id="check" />
      </div>
    </div>

    <atomic-hint v-if="props.hint" v-bind="props.hint" />
    <input type="hidden" :name="props.name" :value="props.value" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    options: any[];
    value: any;
    isRequired?: boolean;
    label?: string;
    placeholder?: string;
    tabIndex?: number;
    name: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
    hint?: any;
    isFitContent?: boolean;
  }>();

  const valueObject = ref<any>('');

  if (props.value) {
    valueObject.value = props.options.find((option: any) => option.code === props.value) || {};
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

  watch(
    () => props.value,
    (newValue: any) => {
      valueObject.value = props.options.find((option: any) => option.code === newValue) || '';
    }
  );

  const open = (): void => {
    if (props.isDisabled) return;
    isOpen.value = !isOpen.value;
    emit('focus');
  };

  const onBlur = (): void => {
    isOpen.value = false;
  };

  onMounted(() => {
    if (props.isFitContent && drop.value && dropItems.value) {
      const width = dropItems.value?.offsetWidth;
      drop.value.style.width = `${width}px`;
      dropItems.value.style.width = `${width}px`;
    }
  });
</script>

<style src="~/assets/styles/components/form/input/dropdown.scss" lang="scss" />
