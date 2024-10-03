<template>
  <div v-if="props.content?.description" class="wallet-warning">
    <div class="wallet-warning__icon">
      <atomic-svg
        :src="props.content?.icon"
        defaultIcon="info"
      />
    </div>
    
    <div class="wallet-warning__description">
      {{ props.content.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    content: {
      icon?: string;
      description: string;
    };
  }>();
</script>

<style src="~/assets/styles/components/wallet/warning.scss" lang="scss"/>
