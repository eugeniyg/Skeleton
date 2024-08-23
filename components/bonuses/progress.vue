<template>
  <div
    class="bonuses-progress"
    ref="progressRef"
  >
    <div
      class="bonuses-progress__line"
      ref="lineRef"
      :style="{ '--width': lineWidthStyle }"
    >
      <div
        class="bonuses-progress__bar"
        ref="barRef"
        :style="`--translateX:  ${barTranslateX}`"
      >{{ value }}%
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    value?: number;
  }>();
  
  const lineWidthStyle = computed(() => {
    return `${props.value}%`;
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
  
  onMounted(() => {
    setBarAlignment();
  });
</script>

<style src="~/assets/styles/components/bonuses/progress.scss" lang="scss"/>
