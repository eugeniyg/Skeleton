<template>
  <div class="pass-progress">
    <div class="items">
      <div
        class="item"
        v-for="(item, index) in variants"
        :key="index"
        :class="index <= getIndex ? `variant-${variants[getIndex]}` : null"
      />
    </div>

    <atomic-hint :message="variants[getIndex]"/>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => ['weak', 'good', 'strong'].includes(val),
    },
    target: {
      type: String,
      default: '',
    },
  });
  const variants = ['weak', 'good', 'strong'];
  const getIndex = computed(() => variants.findIndex((item) => item === props.target));
</script>

<style src="~/assets/styles/components/atomic/pass-progress.scss" lang="scss" />
