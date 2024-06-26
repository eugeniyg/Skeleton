<template>
  <div class="quest-currency" v-if="currencyToShow">
    <div class="quest-currency__item">
      <div class="quest-currency__label">{{ currencyToShow.amount }}</div>
      <div class="quest-currency__value">{{ currencyToShow.currency }}</div>
      <atomic-image
        class="quest-currency__symbol"
        :src="`/img/currency/${currencyToShow.currency}.svg`"
        defaultImage="/img/currency/placeholder.svg"
      />
    </div>
    
    <div v-if="moreCount" class="quest-currency__more">
      <span>+</span>
      <span>{{ moreCount }}</span>
      <span class="quest-currency__more-label">more</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    items: {
      amount: string,
      currency: string,
      type: string
    }[]
  }>();
  
  const emit = defineEmits([]);
  
  const currencyToShow = computed(() => {
    return props.items?.[0]
  });
  
  const moreCount = computed(() => {
    if (props.items?.length && props.items?.length > 2) {
      return props.items?.length - 1
    }
    return false
  })
</script>

<style src="~/assets/styles/components/quest/currency.scss" lang="scss"/>


