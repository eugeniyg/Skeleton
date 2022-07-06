<template>
  <div class="group-favorites">
    <atomic-icon :id="'ui-heart'"/>

    <h2 class="title">Favorites</h2>

    <button-base
      v-if="showAllBtn"
      class="btn-show-all"
      url="/favorites"
      type="ghost"
    >
      Show all
    </button-base>

    <div class="items" ref="container">
      <card-simple
        ref="cardSimple"
        v-for="(favorite, favoriteIndex) in favoriteList"
        :key="favoriteIndex"
        v-bind="favorite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const gameStore = useGamesStore();
  const { favoriteGames } = storeToRefs(gameStore);

  const showAllBtn = ref<boolean>(true);
  const cardInBlock = ref<number>(4);
  const favoriteList = computed(() => favoriteGames.value.slice(0, cardInBlock.value));
  const container = ref();

  const calcItems = ():void => {
    const cardSimple:any = document.querySelector('.group-favorites .card');
    const containerWidth = container.value.offsetWidth;
    const cardWidth = cardSimple.offsetWidth;
    cardInBlock.value = Math.floor(containerWidth / cardWidth);
  };

  onMounted(() => {
    setTimeout(() => {
      calcItems();
    }, 100);
  });
</script>

<style lang="scss" src="./style.scss"/>
