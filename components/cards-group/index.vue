<template>
  <div :class="classes">
    <atomic-icon v-if="props.titleIcon" :id="props.titleIcon"/>

    <h2 v-if="props.title" class="title">{{ props.title }}</h2>

    <button-base v-if="props.showAllBtn" class="btn-show-all" type="ghost">Show all</button-base>

    <button-arrows v-if="props.showArrows"/>

    <div v-if="props.items.length" class="items">
      <slot
        v-for="(item, itemIndex) in props.items"
        :key="itemIndex"
        name="card"
        v-bind="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    variant: {
      type: String,
      validator: (val:string) => [
        'favorites',
        'recently',
        'hot',
        'turbo',
        'providers',
        'new-relises',
        'latest-winners',
        'promotions',
        'latest',
        '',
      ].includes(val),
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    titleIcon: {
      type: String,
      validator: (val:string) => [
        'ui-heart', 'hot', 'turbo-games', 'new', 'bonuses', 'ui-history', '',
      ].includes(val),
      default: 'hot',
    },
    title: {
      type: String,
      default: 'Title',
    },
    showAllBtn: {
      type: Boolean,
      default: false,
    },
    showArrows: {
      type: Boolean,
      default: false,
    },
  });
  const classes = computed(() => (props.variant ? `cards cards-${props.variant}` : 'cards'));
</script>

<style lang="scss" src="./style.scss"/>
