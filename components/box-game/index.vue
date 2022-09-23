<template>
  <div class="box-game">
    <div class="container">
      <!--<not-auth-game
        text="This game is not available in the fun mode, <br>please login or register to play."
        src="/svg/colored/ex-sign.svg"
        title="Please, login"
      />-->
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

    <panel-mode :gameContent="gameContent" @changeMode="emit('changeMode')"/>

    <group-games
      :category="popularCategory"
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
  const popularCategory = gameCollections.find((collection) => collection.identity === 'popular');
</script>

<style lang="scss" src="./style.scss"/>
