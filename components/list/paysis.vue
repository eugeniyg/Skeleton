<template>
  <div class="paysis">
    <template v-for="{image, display, name} in props.items">
      <atomic-image
        v-if="display"
        class="logo"
        width="114"
        height="24"
        :src="image"
        :key="name"
        :alt="name"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { IPaymentItem } from '~/types';
  
  const props = defineProps<{
    items: IPaymentItem[]
  }>();
</script>

<style src="~/assets/styles/components/list/paysis.scss" lang="scss"/>

