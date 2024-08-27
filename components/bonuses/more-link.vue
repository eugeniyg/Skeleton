<template>
  <nuxt-link class="bonuses-more-link" :to="props.href" @click="showModal('bonusInfo')">
    <span class="bonuses-more-link__title">More info</span>
    <atomic-icon class="bonuses-more-link__icon" id="question"/>
  </nuxt-link>
</template>

<script setup lang="ts">
  const props = defineProps<{href?: string}>();
  const { showModal } = useLayoutStore();
</script>

<style src="~/assets/styles/components/bonuses/more-link.scss" lang="scss"/>

