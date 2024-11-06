<template>
  <div class="pass-progress">
    <div class="items">
      <div
        v-for="(item, index) in variants"
        :key="index"
        class="item"
        :class="index <= getIndex ? `variant-${variants[getIndex]}` : null"
      />
    </div>

    <atomic-hint :message="variants[getIndex]" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    variant: 'weak' | 'good' | 'strong';
    target?: string;
  }>();
  const variants = ['weak', 'good', 'strong'];
  const getIndex = computed(() => variants.findIndex(item => item === props.target));
</script>

<style src="~/assets/styles/components/atomic/pass-progress.scss" lang="scss" />
