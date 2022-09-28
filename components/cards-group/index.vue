<template>
  <div :class="classes">
    <atomic-icon v-if="props.titleIcon" :id="props.titleIcon"/>

    <div v-if="props.name && props.subTitle" class="titles">
      <h2 class="title">{{ props.name }}</h2>
      <h4 class="sub-title">{{ props.subTitle }}</h4>
    </div>

    <h2 v-else class="title">{{ props.name || props.identity }}</h2>

    <button-base
      v-if="props.showAllBtn"
      class="btn-show-all"
      type="ghost"
      @click="openGames(props.identity)"
    >
      {{ groupContent?.moreButton }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      @clickAction="clickAction"
    />

    <div
      v-if="props.games.length"
      ref="scrollContainer"
      class="items"
      @scroll="scrollHandler"
    >
      <slot
        v-for="game in props.games"
        :key="game.id"
        name="card"
        v-bind="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CardsGroupInterface } from '~/types';

  const props = defineProps({
    games: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: () => '',
      required: false,
    },
    variant: {
      type: String,
      validator: (val:string) => [
        'favorites',
        'recently',
        'hot',
        'turbo',
        'providers',
        'new-relises',
        'latest-winners',
        'promotions',
        'latest',
        'benefits',
      ].includes(val),
      required: false,
    },
    titleIcon: {
      type: String,
      validator: (val:string) => [
        'heart', 'hot', 'turbo-games', 'new', 'bonuses', 'history', '',
      ].includes(val),
      default: '',
    },
    id: {
      type: String,
      required: true,
    },
    identity: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      required: false,
    },
    showAllBtn: {
      type: Boolean,
      default: false,
    },
    showArrows: {
      type: Boolean,
      default: false,
    },
  });

  const { globalComponentsContent } = useGlobalStore();
  const groupContent:CardsGroupInterface|undefined = globalComponentsContent?.cardsGroup;

  const router = useRouter();
  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(props.showArrows);

  const scrollHandler = ():void => {
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
  };

  const clickAction = (direction: string):void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth : -offsetWidth,
      behavior: 'smooth',
    });
  };

  const classes = computed(() => (props.variant ? `cards cards-${props.variant}` : 'cards'));

  onMounted(() => {
    if (props.showArrows) {
      // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
      setTimeout(() => {
        scrollHandler();
        showArrowButtons.value = props.showArrows && (!prevDisabled.value || !nextDisabled.value);
      }, 100);
    }
  });

  const { localizePath } = useProjectMethods();
  const openGames = (identity: string):void => {
    router.push(localizePath(`/games?category=${identity}`));
  };
</script>

<style lang="scss" src="./style.scss"/>
