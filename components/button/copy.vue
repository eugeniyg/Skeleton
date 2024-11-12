<template>
  <div class="btn-copy__wrap">
    <transition name="fade" mode="out-in">
      <div v-if="tooltipVisible" class="btn-copy__tooltip">{{ props.copyTooltip }}</div>
    </transition>

    <button class="btn-copy" @click="actionClick">
      {{ props.copyButton }}
      <atomic-icon id="copy" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import copy from 'copy-to-clipboard';

  const props = defineProps<{
    text: string;
    copyButton: string;
    copyTooltip: string;
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
    copy(props.text || '');
    showTooltip();
  };
</script>

<style src="~/assets/styles/components/button/copy.scss" lang="scss" />
