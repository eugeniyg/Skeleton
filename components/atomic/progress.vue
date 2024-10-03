<template>
  <div class="progress">
    <span class="progress__bar" :style="{'--progress-bar': percentage + '%'}"/>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['change-status', 'hide-progress']);

  const props = defineProps({
    value: {
      type: Number,
      default: 0,
    },
  });
  const percentage = ref(props.value);

  onMounted(() => {
    setTimeout(() => {
      percentage.value = 100;
    }, 500);

    setTimeout(() => {
      emit('hide-progress');
    }, 2000);
  });
</script>

<style src="~/assets/styles/components/atomic/progress.scss" lang="scss" />
