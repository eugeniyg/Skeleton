<template>
  <div class="copy-field">
    <div class="copy-field__content">
      <span v-if="props.label" class="copy-field__label">{{ props.label }}</span>
      <span v-if="props.value" class="copy-field__value">{{ props.value }}</span>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="tooltipVisible" class="copy-field__tooltip">{{ props.tooltip }}</div>
    </transition>

    <button-base type="primary" size="sm" @click="actionClick">
      <atomic-icon id="copy" />
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';

  const props = defineProps<{
    label?: string;
    value?: string;
    tooltip?: string;
  }>();

  const tooltipVisible = ref<boolean>(false);
  const tooltipTimer = ref<any>(undefined);

  const showTooltip = (): void => {
    tooltipVisible.value = true;

    clearTimeout(tooltipTimer.value);
    tooltipTimer.value = setTimeout(() => {
      tooltipVisible.value = false;
    }, 2000);
  };

  const actionClick = () => {
    copy(props.value || '');
    showTooltip();
  };
</script>

<style src="~/assets/styles/components/atomic/copy-field.scss" lang="scss" />
