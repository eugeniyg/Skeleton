<template>
  <nuxt-link v-if="props.count" to="/" class="bonuses-see-all-link">
    See all {{ props.count }} bonuses
  </nuxt-link>
</template>

<script setup lang="ts">
  const props = defineProps<{ count?: number }>();
</script>


<style src="~/assets/styles/components/bonuses/see-all-link.scss" lang="scss"/>
