<template>
  <div class="arrows">
    <button
      class="btn-prev"
      :disabled="props.prevDisabled"
      data-action="prev"
      @click="clickNavigation(false)"
    >
      <atomic-icon id="ui-arrow_expand-close"/>
    </button>

    <button
      class="btn-next"
      :disabled="props.nextDisabled"
      data-action="next"
      @click="clickNavigation(true)"
    >
      <atomic-icon id="ui-arrow_expand-close"/>
    </button>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    prevDisabled: {
      type: Boolean,
      default: true,
    },
    nextDisabled: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['clickAction']);
  const clickNavigation = (goNext:boolean):void => {
    if ((goNext && props.nextDisabled) || (!goNext && props.prevDisabled)) return;
    emit('clickAction', goNext);
  };
</script>

<style lang="scss" src="./style.scss"/>
