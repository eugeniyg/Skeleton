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
    </div>
    <client-only>
      <nav-game :gameInfo="gameInfo"/>
    </client-only>
    <panel-mode @changeMode="emit('changeMode')"/>

    <group-games
      :category="popularCategory"
      showArrows
      subTitle="The best games for you"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    frameLink: {
      type: String,
      required: false,
    },
    gameInfo: {
      type: Object,
      required: false,
    },
  });
  const emit = defineEmits(['changeMode']);

  const { gameCollections } = useGamesStore();
  const popularCategory = gameCollections.find((collection) => collection.identity === 'popular');
</script>

<style lang="scss" src="./style.scss"/>
