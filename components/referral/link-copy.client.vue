<template>
  <label
    class="referral-link-copy"
    :for="props.name"
    data-tooltip-parent
    :class="{ 'is-focused': tooltipVisible }"
  >
    <div class="referral-link-copy__row">
      <transition name="fade" mode="out-in">
        <div v-if="tooltipVisible" class="referral-link-copy__tooltip">
          {{ props.copyTooltip || 'Copied' }}
        </div>
      </transition>

      <input
        :id="props.name"
        ref="copyInput"
        :value="displayValue"
        class="referral-link-copy__field"
        readonly
        :name="props.name"
      />
      <div ref="cloneElement" class="input-copy__clone">
        <span v-for="(char, index) in props.value || ''" :key="index">{{ char }}</span>
      </div>

      <button class="referral-link-copy__desktop-btn" @click.prevent="copyValue">
        <atomic-icon id="copy" />
      </button>
    </div>

    <button-base class="referral-link-copy__mobile-btn" @click.prevent="copyValue">
      <span class="referral-link-copy__mobile-btn-label">Copy</span>
      <atomic-icon id="copy" />
    </button-base>
  </label>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';
  import debounce from 'lodash/debounce';

  const props = defineProps<{
    name: string;
    value?: string;
    label?: string;
    copyTooltip?: string;
  }>();

  const copyInput = useTemplateRef('copyInput');

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
    copyInput.value?.select();
    copy(props.value || '');
    showTooltip();
  };

  const displayValue = ref<string>('');
  const cloneElement = useTemplateRef('cloneElement');
  const getDisplayValue = (): string => {
    if (!props.value || !copyInput.value || !cloneElement.value) return '';

    const inputWidth = copyInput.value?.clientWidth - 32;
    const contentWidth = cloneElement.value?.scrollWidth;
    if (contentWidth <= inputWidth) return props.value || '';
    
    const lastCount = 5;
    const value = props.value;
    if (value.length <= lastCount + 3) return value;

    const firstCount = Math.max(10, value.length - 10);
    const firstPart = value.slice(0, firstCount);
    const lastPart = value.slice(-lastCount);
    return `${firstPart}...${lastPart}`;
  };

  const updateDisplayValue = async () => {
    await nextTick();
    displayValue.value = getDisplayValue();
  };

  onMounted(updateDisplayValue);

  watch(() => props.value, updateDisplayValue);

  const debouncedUpdateDisplayValue = debounce(updateDisplayValue, 200);

  onMounted(() => {
    window.addEventListener('resize', debouncedUpdateDisplayValue);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debouncedUpdateDisplayValue);
  });
</script>

<style src="~/assets/styles/components/referral/link-copy.scss" lang="scss" />
