<template>
  <div class="card-base" :style="backgroundImage">
    <div v-if="props.bages && props.bages.length" class="bages">
      <atomic-bage
        v-for="(bage, bageIndex) in props.bages"
        :key="bageIndex"
        :variant="bage.variant"
      >
        {{ bage.title }}
      </atomic-bage>
    </div>

    <div class="info">
      <div v-if="props.title" class="title">{{ props.title }}</div>

      <div v-if="props.subTitle" class="sub-title">{{ props.subTitle }}</div>

      <button-favorite v-if="props.showFavorite"/>

      <button-play v-if="props.showPlayBtn"/>

      <button-base
        v-if="props.showTryBtn"
        class="btn-try"
        type="secondary"
        size="xs"
      >
        Try for fun
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    bages: {
      type: Array || undefined,
      default: () => [],
    },
    showFavorite: {
      type: Boolean,
      default: false,
    },
    showPlayBtn: {
      type: Boolean,
      default: true,
    },
    showTryBtn: {
      type: Boolean,
      default: true,
    },
  });

  const backgroundImage = computed(() => `background-image:url(/img${props.src})`);
</script>

<style lang="scss" src="./style.scss"/>
