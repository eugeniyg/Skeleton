<template>
  <div class="box-game" :class="boxGameClassModifiers">
    <h1 class="box-game__title">{{ props.gameInfo?.name }}</h1>

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

    <transition name="fade" mode="out-in">
      <panel-mode
        v-if="!showPlug && props.isDemo"
        :gameContent="gameContent"
        @changeMode="emit('changeMode')"
      />
    </transition>

    <group-games
      v-if="recommendedCategory"
      :category="recommendedCategory"
      showArrows
      subTitle
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { IGame } from "@skeleton/core/types";
  import { IGamePage } from "~/types";

  const props = defineProps<{
    frameLink?: string;
    showPlug: boolean;
    gameInfo?: IGame;
    gameContent?: IGamePage;
    isDemo: boolean;
  }>();

  const emit = defineEmits(['changeMode']);

  const { currentLocationCollections } = useGamesStore();
  const recommendedCategory = currentLocationCollections.find((collection) => collection.identity === 'recommended');
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const boxGameClassModifiers = computed(() => {
    return [
      isLoggedIn.value ? 'box-game--login' : 'box-game--logout',
      { 'box-game--demo': props.isDemo }
    ]
  });
</script>

<style src="~/assets/styles/components/box-game.scss" lang="scss" />

