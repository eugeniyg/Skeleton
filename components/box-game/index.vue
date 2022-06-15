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
    <nav-game/>
    <panel-mode @changeMode="emit('changeMode')"/>

    <cards-group
      v-if="popularGames.length"
      v-bind="popularCategory"
      :games="popularGames"
      showArrows
      subTitle="The best games for you"
    >
      <template v-slot:card="item">
        <card-base v-bind="item"/>
      </template>
    </cards-group>
  </div>
</template>

<script setup lang="ts">
  import { GameInterface } from '~/types/gameTypes';
  import { useGamesApi } from '~/CORE/index';

  const props = defineProps({
    frameLink: {
      type: String,
      required: false,
    },
    gameInfo: {
      type: Object,
      required: true,
    },
  });
  const emit = defineEmits(['changeMode']);
  const popularGames = ref<GameInterface[]>([]);

  const { gameCollections } = useGamesStore();
  const popularCategory = gameCollections.find((collection) => collection.identity === 'popular');

  const { getFilteredGames } = useGamesApi();
  onMounted(async () => {
    if (popularCategory) {
      const { data } = await getFilteredGames({ collectionId: popularCategory.id });
      popularGames.value = data;
    }
  });
</script>

<style lang="scss" src="./style.scss"/>
