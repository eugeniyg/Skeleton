<template>
  <div class="nav-game">
    <nav-action :showPlug="showPlug" :gameInfo="props.gameInfo" />
    <!--    <nav-mode :items="modeItems"/>-->
  </div>
</template>

<script setup lang="ts">
  import { GameInterface } from '@platform/frontend-core/dist/module';

  const props = defineProps<{
    gameInfo: GameInterface,
    showPlug: boolean,
  }>();
</script>

<style lang="scss">
.nav-game {
  background-color: var(--black-primary);
  width: rem(40px);
  display: grid;
  grid-gap: rem(8px);
  align-self: flex-start;

  .icon {
    --color: var(--gray-400);
  }

  .item {
    @extend %skip-btn;
    background-color: var(--bg, var(--gray-900));
    width: rem(40px);
    height: rem(40px);

    &:hover {
      cursor: pointer;

      &:not(.is-active) {
        .icon {
          --color: var(--white);
        }
      }
    }

    &.is-active {
      --bg: var(--gray-700);

      .icon {
        --color: var(--yellow-500);
      }
    }
  }
}
</style>
