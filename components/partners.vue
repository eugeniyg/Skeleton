<template>
  <div class="partners" v-if="props.items?.length">
    <div class="partners__title">{{ props.label }}</div>
    <div class="partners__items">
      <a class="partners__item" v-for="item in props.items" :href="item.url" target=”_blank”>
        <atomic-image class="partners__logo" :src="item.image"/>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    label: string,
    items: {
      url: string,
      image: string
    }[]
  }>();
</script>

<style lang="scss">
.partners {
  display: grid;
  margin-bottom: rem(8px);
  
  &::after {
    content: '';
    position: relative;
    border-bottom: 1px solid var(--border-01);
  }
  
  &__title {
    @include font($subheading-2);
    color: var(--text-secondary);
    padding: rem(8px) 0;
    text-align: center;
    
    .is-compact & {
      display: none;
    }
  }
  
  &__items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-bottom: rem(16px);
    grid-gap: rem(4px);
    
    .is-compact & {
      display: block;
    }
  }
  
  &__item {
    text-decoration: none;
    cursor: pointer;
    
    .is-compact & {
      display: flex;
      width: rem(40px);
      height: rem(40px);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      background-color: var(--layer-03-low-contrast);
      
      &:not(:first-of-type) {
        display: none;
      }
    }
  }
  
  &__logo {
    display: block;
    max-width: 100%;
    width: 48px;
    
    .is-compact & {
      width: 32px;
    }
  }
}
</style>
