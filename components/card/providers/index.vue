<template>
  <div class="card-providers">
    <img class="img" :src="`/img${props.src}`" />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },

  });
</script>

<style lang="scss" src="./style.scss"/>
