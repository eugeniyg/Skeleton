<template>
  <div class="progress">
    <span class="progress__bar" :style="{'--progress-bar': percentage + '%'}"></span>
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

<style lang="scss">
.progress {
  height: rem(4px);
  position: absolute;
  width: 100%;
  overflow: hidden;
  background-color: var(--gray-600);
  border-radius: 2px;
  bottom: 0;
  left: 0;
  transform: translateY(rem(8px));

  &__bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: var(--progress-bar, 0%);
    transition: width 1s ease-in-out;
    background-color: var(--blue-500);
  }
}
</style>
