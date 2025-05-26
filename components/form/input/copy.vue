<template>
  <label :class="classes" :for="props.name">
    <span v-if="props.label" class="label">{{ label }}</span>

    <div class="row">
      <transition name="fade" mode="out-in">
        <div v-if="tooltipVisible" class="input-copy__tooltip">
          {{ props.copyTooltip || 'Copied' }}
        </div>
      </transition>

      <input :id="props.name" ref="copyInput" :value="displayValue" class="field" readonly :name="props.name" />
      <div ref="cloneElement" class="input-copy__clone">
        <span v-for="(char, index) in props.value || ''" :key="index">{{ char }}</span>
      </div>

      <button class="btn-copy" @click.prevent="copyValue">
        <atomic-icon id="copy" />
      </button>
    </div>

    <atomic-hint v-if="props.hint" v-bind="hint" />
  </label>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';

  const props = defineProps<{
    name: string;
    value?: string;
    label: string;
    copyTooltip?: string;
    hint?: { variant?: string; message?: string };
  }>();

  const classes = computed(() => ['input-copy', { 'has-error': props.hint?.variant === 'error' }]);
  const copyInput = ref();

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const showTooltip = (): void => {
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

  const displayValue = ref<string>('');
  const cloneElement = useTemplateRef('cloneElement');
  const getDisplayWidth = (): string => {
    if (!props.value || !copyInput.value || !cloneElement.value) return '';

    const inputWidth = copyInput.value.clientWidth - 32;
    const contentWidth = cloneElement.value.scrollWidth;
    if (contentWidth <= inputWidth) return props.value || '';

    const childElements = cloneElement.value.children;
    const childElementsArr = [...childElements] as HTMLElement[];
    let commonWidth = 0;
    let visibleChars = 0;
    for (let i = 0; i < childElementsArr.length; i++) {
      const startElementWidth = childElementsArr[i].offsetWidth;
      if (commonWidth + startElementWidth > inputWidth) break;
      commonWidth += startElementWidth;
      visibleChars += 1;
      const stringLength = childElementsArr.length;
      const endElementWidth = childElementsArr[stringLength - 1 - i].offsetWidth;
      if (commonWidth + endElementWidth > inputWidth) break;
      commonWidth += endElementWidth;
      visibleChars += 1;
    }
    const partChars = Math.floor((visibleChars - 5) / 2);
    const firstPart = props.value.slice(0, partChars);
    const lastPart = props.value.slice(-partChars);
    return `${firstPart} . . . ${lastPart}`;
  };

  watch(
    () => props.value,
    async () => {
      await nextTick();
      displayValue.value = getDisplayWidth();
    },
    { immediate: true }
  );
</script>

<style src="~/assets/styles/components/form/input/copy.scss" lang="scss" />
