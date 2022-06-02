<template>
  <box-game :frameLink="gameStart" :gameInfo="gameInfo"/>
</template>

<script setup lang="ts">
  import { gameInfoInterface, gameStartInterface } from '~/types/gameTypes';
  import { useGamesApi } from '~/CORE/index';

  definePageMeta({
    middleware: ['auth'],
  });

  const route = useRoute();
  const gameInfo = ref<gameInfoInterface>();
  const gameStart = ref<gameStartInterface>();
  const { getGamesInfo, getStartGame } = useGamesApi();
  const { profile } = useProfileStore();
  const infoResponse = await useAsyncData('gameInfo', () => getGamesInfo(route.params.id));
  gameInfo.value = infoResponse.data.value;
  const startParams = {
    accountId: profile.id,
    lobbyUrl: 'http://192.168.0.109:3000',
    locale: 'en',
    countryCode: 'UA',
    platform: 2,
  };
  const startResponse = await useAsyncData('gameStart', () => getStartGame(route.params.id, startParams));
  gameStart.value = startResponse.data.value?.gameUrl;

  onMounted(() => {
    document.body.classList.add('is-mob-nav-vertical');
    document.body.classList.add('is-game-page');
  });

  onBeforeUnmount(() => {
    document.body.classList.remove('is-mob-nav-vertical');
    document.body.classList.remove('is-game-page');
  });
</script>

<style lang="scss" src="./game.scss"/>
