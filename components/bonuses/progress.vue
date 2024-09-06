<template>
  <div
    ref="progressRef"
    class="bonuses-progress"
    :class="props.isFreeSpin ? 'bonuses-progress--freespin' : 'bonuses-progress--cash'"
  >
    <div
      ref="lineRef"
      class="bonuses-progress__line"
      :style="{ '--width': lineWidthStyle }"
    >
      <div
        ref="barRef"
        class="bonuses-progress__bar"
        :style="`--translateX:  ${barTranslateX}`"
      >
        {{ props.progress }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    progress: number;
    isFreeSpin?: boolean;
  }>();

  const lineWidthStyle = computed(() => {
    return `${props.progress}%`;
  });

  const barTranslateX = ref('');

  const progressRef = ref<HTMLElement>();
  const lineRef = ref<HTMLElement>();
  const barRef = ref<HTMLElement>();

  const setBarAlignment = () => {
    if (progressRef.value && lineRef.value && barRef.value) {
      const progressWidth = progressRef.value.getBoundingClientRect().width;
      const lineWidth = lineRef.value.getBoundingClientRect().width;
      const barWidth = barRef.value.getBoundingClientRect().width;

      if (lineWidth < barWidth) {
        barTranslateX.value = '100%';
      } else if (lineWidth > progressWidth - barWidth) {
        barTranslateX.value = '0%';
      } else {
        barTranslateX.value = '50%';
      }
    }
  };

  watch(() => props.progress, () => setBarAlignment());

  onMounted(() => {
    setBarAlignment();
  });
</script>

<style src="~/assets/styles/components/bonuses/progress.scss" lang="scss"/>