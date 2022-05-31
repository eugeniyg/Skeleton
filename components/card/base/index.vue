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
      <div v-if="props.name" class="title">{{ props.name }}</div>

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
      required: false,
    },
    name: {
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

  const getRandomInt = (min:number, max:number):number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const backgroundImage = computed(() => `background-image:url(/img/cards/card-${getRandomInt(1, 7)}.jpeg)`);
</script>

<style lang="scss" src="./style.scss"/>
