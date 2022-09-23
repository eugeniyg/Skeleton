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
        :gameContent="gameContent"
      />
    </div>

    <client-only>
      <nav-game :showPlug="showPlug" :gameInfo="gameInfo"/>
    </client-only>

    <panel-mode v-if="!showPlug" :gameContent="gameContent" @changeMode="emit('changeMode')"/>

    <group-games
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

<style lang="scss" src="./style.scss"/>
