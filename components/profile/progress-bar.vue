<template>
  <div class="progress-bar">
    <div class="labels">
      <span class="label">1{{ sidebarContent?.profileMenu?.levelLabel}}</span>
      <span class="label">2{{ sidebarContent?.profileMenu?.levelLabel}}</span>
    </div>

    <div class="bar" :style="`--bar-percents: ${props.percents}`"></div>
    <div class="percents">{{ props.percents }}</div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    percents: {
      type: String,
      default: '50%',
    },
  });
  const { sidebarContent } = useGlobalStore();
</script>

<style lang="scss">
.progress-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  align-items: center;
  grid-gap: rem(4px) rem(8px);
  width: 100%;
  grid-template-areas:
    "labels labels labels"
    "bar bar perc";
  @include radius(8px);

  .labels {
    display: flex;
    grid-area: labels;
    justify-content: space-between;
    padding: 0 rem(8px);
  }

  .label {
    @include font($body-1);
    color: var(--gray-400);
  }

  .bar {
    background-color: var(--bg, var(--gray-700));
    @include radius(999px);
    position: relative;
    overflow: hidden;
    display: flex;
    width: 100%;
    height: var(--height, #{rem(8px)});
    grid-area: bar;

    &:before {
      display: flex;
      content: '';
      width: var(--bar-percents, 0);
      height: var(--height);
      background-color: var(--bg, var(--gray-300));
      @include radius(999px);
      transition: width .4s ease-in-out;
      min-width: rem(6px);
    }
  }

  .percents {
    grid-area: perc;
    @include font($heading-1);
    color: var(--white);
  }
}
</style>
