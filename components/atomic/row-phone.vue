<template>
  <div class="row-phone">
    <atomic-image class="img" :src="`/img${props.src}`" width="24" height="20" />
    {{ props.number }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      default: '/flags/us.svg',
    },
    number: {
      type: String,
      default: '-',
    },
  });
</script>

<style src="~/assets/styles/components/atomic/row-phone.scss" lang="scss" />
