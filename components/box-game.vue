<template>
  <div class="box-game" :class="boxGameClasses">
    <div class="box-game__header">
      <h1 class="box-game__title">{{ props.gameInfo?.name }}</h1>
      
      <template v-if="!props.isDemo">
        <atomic-divider/>
        <wager-tooltip is-inline/>
      </template>
    </div>
    
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
        @changeMode="changeGameMode"
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
  import type { IGame } from "@skeleton/core/types";
  import type { IGamePage } from "~/types";

  const props = defineProps<{
    frameLink?: string;
    showPlug: boolean;
    gameInfo?: IGame;
    gameContent?: IGamePage;
    isDemo: boolean;
  }>();

  const emit = defineEmits(['changeMode']);

  const { getCollectionsList, defineBonusWagerInfo } = useGamesStore();
  const { data: gameCollections } = await useLazyAsyncData(() => getCollectionsList(), { server: false });
  const recommendedCategory = computed(() => gameCollections.value?.find((collection) => collection.identity === 'recommended'));

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);

  const boxGameClassModifiers = computed(() => {
    return [
      isLoggedIn.value ? 'box-game--login' : 'box-game--logout',
      { 'box-game--demo': props.isDemo }
    ]
  });
  const boxGameClasses = ref<any[]>([]);

  watch(() => boxGameClassModifiers.value, (newValue) => {
    boxGameClasses.value = newValue;
  })
  
  const changeGameMode = () => {
    emit('changeMode');
    if (props.gameInfo?.isBonusWagering && props.gameInfo?.minimumBonusWagerMultiplier) {
      defineBonusWagerInfo(props.gameInfo.isBonusWagering, props.gameInfo.minimumBonusWagerMultiplier);
    }
  }
  
  onMounted(() => {
    boxGameClasses.value = boxGameClassModifiers.value;
    if (props.gameInfo?.isBonusWagering && props.gameInfo?.minimumBonusWagerMultiplier) {
      defineBonusWagerInfo(props.gameInfo.isBonusWagering, props.gameInfo.minimumBonusWagerMultiplier);
    }
  });
  
  onUnmounted(() => {
    defineBonusWagerInfo(false, 1);
  });
  
</script>

<style src="~/assets/styles/components/box-game.scss" lang="scss" />

