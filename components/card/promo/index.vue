<template>
  <div class="promo-card">
    <img src="~/assets/img/slides/promo.png"/>
    <div class="actions">
      <div class="title">{{ props.title }}</div>
      <div class="sub-title">{{ props.subTitle }}</div>
      <button-base v-if="props.actionBtn.show" type="primary" size="md">{{ props.actionBtn.text }}</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: 'Play over 3000 provably fair games',
    },
    subTitle: {
      type: String,
      default: 'Win big by choosing the correct side. Pick a side and let luck decide!',
    },
    actionBtn: {
      type: Object,
      default: () => ({
        show: true,
        text: 'More information',
      }),
    },
  });
</script>

<style lang="scss" src="./style.scss"/>
