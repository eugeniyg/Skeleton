<template>
  <div class="result-search" :class="{'is-show': props.isShow}">
    <div class="box">
      <div class="header" v-if="!props.items.length">
        <div class="heading">Nothing found</div>
        <div class="text">Try searching for something else</div>
      </div>

      <div class="items">
        <div class="label" v-if="!props.items.length">Or try these popular games:</div>

        <div
          v-for="game in activeItems"
          :key="game.id"
          class="item"
          @click="clickGame(game)"
        >
          <img :src="`/img/cards/card-${getRandomInt(1, 12)}.png`" />
          <span>{{ game.name }}</span>
        </div>

        <div class="footer" v-if="isShowLoadMore">
          <button-base type="ghost" size="xs" @click="emit('loadMore')">Load more</button-base>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useGlobalMethods } from '~/CORE';
  import { GameInterface } from '~/types/gameTypes';

  const props = defineProps({
    isShow: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    defaultItems: {
      type: Array,
      default: () => [],
    },
    isShowLoadMore: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['loadMore', 'hideSearch']);

  const { getRandomInt } = useGlobalMethods();
  const activeItems = computed(() => (props.items.length ? props.items : props.defaultItems));

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const router = useRouter();
  const clickGame = (gameData:GameInterface):void => {
    if (!isLoggedIn.value) {
      router.push(`/games/${gameData.id}${gameData.isDemoMode ? '?demo=true' : ''}`);
    } else router.push(`/games/${gameData.id}`);
    emit('hideSearch');
  };
</script>

<style lang="scss" src="./style.scss"/>
