<template>
  <label :class="classes" :for="props.name">
    <span v-if="props.label" class="label">
      {{ label }}<span v-if="props.isRequired" class="required">*</span>
    </span>

    <div class="row">
      <transition name="fade" mode="out-in">
        <div v-if="tooltipVisible" class="input-copy__tooltip">
          {{ props.copyTooltip || 'Copied' }}
        </div>
      </transition>

      <input
        :id="props.name"
        ref="copyInput"
        class="field"
        readonly
        :value="props.value || ''"
        :name="props.name"
        :required="props.isRequired"
        :placeholder="props.placeholder"
        @blur="emit('blur')"
        @input="emit('input')"
      >

      <button class="btn-copy" @click.prevent="copyValue">
        <atomic-icon id="copy"/>
      </button>
    </div>

    <atomic-hint v-if="props.hint" v-bind="hint"/>
  </label>
</template>

<script setup lang="ts">
  import copy from "copy-to-clipboard";

  const props = defineProps<{
    name: string;
    value: string;
    label: string;
    placeholder?: string;
    isRequired?: boolean;
    copyTooltip?: string;
    hint?: { variant?: string, message?: string };
  }>();

  const classes = computed(() => [
    'input-copy',
    { 'has-error': props.hint?.variant === 'error' },
  ]);

  const emit = defineEmits(['blur', 'input']);
  const copyInput = ref();

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const showTooltip = ():void => {
    tooltipVisible.value = true;
    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const copyValue = (): void => {
    copyInput.value.select();
    copy(props.value || '');
    showTooltip();
  };
</script>

<style src="~/assets/styles/components/form/input/copy.scss" lang="scss" />

