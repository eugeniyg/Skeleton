<template>
  <div class="cards">
    <atomic-icon v-if="props.titleIcon" :id="props.titleIcon"/>

    <div v-if="props.identity && props.subTitle" class="titles">
      <h2 class="title">{{ props.identity }}</h2>
      <h4 class="sub-title">{{ props.subTitle }}</h4>
    </div>

    <h2 v-else class="title">{{ props.identity }}</h2>

    <button-base v-if="props.showAllBtn" class="btn-show-all" type="ghost">Show all</button-base>

    <button-arrows v-if="props.showArrows"/>

    <div v-if="props.games.length" class="items">
      <slot
        v-for="game in props.games"
        :key="game.id"
        name="card"
        v-bind="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    games: {
      type: Array,
      default: () => [],
    },
    titleIcon: {
      type: String,
      validator: (val:string) => [
        'ui-heart', 'hot', 'turbo-games', 'new', 'bonuses', 'ui-history', '',
      ].includes(val),
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    identity: {
      type: String,
      default: 'Title',
    },
    subTitle: {
      type: String,
      required: false,
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
</script>

<style lang="scss" src="./style.scss"/>
