<template>
  <div class="box-game">
    <div class="container">
      <iframe
        v-if="props.frameLink"
        :key="props.frameLink"
        :src="props.frameLink"
        height="100%"
        width="100%"
      />

      <not-auth-game
        v-else-if="showPlug && gameContent?.plug"
        v-bind="gameContent.plug"
      />
    </div>

    <nav-game :showPlug="showPlug" :gameInfo="gameInfo"/>

    <panel-mode v-if="!showPlug" :gameContent="gameContent" @changeMode="emit('changeMode')"/>

    <group-games
      v-if="recommendedCategory"
      :category="recommendedCategory"
      showArrows
      subTitle
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    frameLink: {
      type: String,
      required: false,
    },
    showPlug: {
      type: Boolean,
      default: true,
    },
    gameInfo: {
      type: Object,
      required: false,
    },
    gameContent: {
      type: Object,
      required: false,
    },
  });
  const emit = defineEmits(['changeMode']);

  const { gameCollections } = useGamesStore();
  const recommendedCategory = gameCollections.find((collection) => collection.identity === 'recommended');
</script>

<style lang="scss">
.box-game {
  display: grid;
  grid-template-areas:
    "container nav"
    "panel nav";
  align-items: var(--align-items, flex-end);
  grid-template-columns: 1fr auto;
  width: 100%;
  height: 100%;

  .container {
    background-color: var(--black-primary);
    grid-area: container;
    position: relative;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);

    @include media(md) {
      height: calc(100vh - 160px);
    }

    iframe {
      display: block;
      border: none !important;

      @include media(l) {
        position: relative;
      }
    }
  }

  .nav-game {
    grid-area: nav;
  }

  .panel-mode {
    grid-area: panel;
  }
}
</style>
