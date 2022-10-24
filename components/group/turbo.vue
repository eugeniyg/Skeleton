<template>
  <div v-if="groupTurboContent?.items?.length" class="group-turbo">
    <atomic-icon v-if="groupTurboContent?.icon" :id="groupTurboContent.icon"/>

    <h2 class="title">{{ groupTurboContent?.label }}</h2>

    <button-base
      class="btn-show-all"
      type="ghost"
      :url="'/games?category=turbogames'"
    >
      {{ groupCardContent?.moreButton }}
    </button-base>

    <button-arrows
      v-if="showArrowButtons"
      :prevDisabled="prevDisabled"
      :nextDisabled="nextDisabled"
      @clickAction="clickAction"
    />

    <div
      ref="scrollContainer"
      class="items"
      @scroll="scrollHandler"
    >
      <card-turbo
        v-for="(item, itemIndex) in groupTurboContent.items"
        :key="itemIndex"
        v-bind="item"
        :buttonLabel="groupTurboContent.buttonLabel"
        :infoLabel="groupTurboContent.infoLabel"
        :categoryLabel="groupTurboContent.categoryLabel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { TurbogamesGroupInterface, CardsGroupInterface } from '~/types';

  const { globalComponentsContent } = useGlobalStore();
  const groupTurboContent:TurbogamesGroupInterface|undefined = globalComponentsContent?.turbogames;
  const groupCardContent:CardsGroupInterface|undefined = globalComponentsContent?.cardsGroup;

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(true);

  const scrollHandler = ():void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth < (scrollLeft + offsetWidth + 20) && scrollWidth > (scrollLeft + offsetWidth - 20);
  };

  const clickAction = (direction: string):void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth / 1.4 : -offsetWidth / 1.4,
      behavior: 'smooth',
    });
  };

  onMounted(() => {
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587; https://github.com/vuejs/core/issues/5844
    setTimeout(() => {
      scrollHandler();
      showArrowButtons.value = !prevDisabled.value || !nextDisabled.value;
    }, 300);
  });
</script>

<style lang="scss">
.group-turbo {
  display: grid;
  align-items: center;
  grid-template-areas:
    "icon heading heading arrows"
    "items items items items"
    "btn-show-all btn-show-all btn-show-all btn-show-all";
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto) minmax(0, auto);
  grid-column-gap: var(--column-gap, #{rem(8px)});
  grid-row-gap: var(--row-gap, #{rem(16px)});
  margin-top: 32px;
  margin-bottom: 40px;
  overflow: hidden;

  @include media(xs) {
    grid-template-areas:
    "icon heading btn-show-all arrows"
    "items items items items";
  }

  > [data-icon] {
    font-size: rem(20px);
    grid-area: icon;
  }

  > .icon {
    grid-area: icon;
    --iccon-size: #{rem(20px)};
    --color: var(--gray-400);
  }

  > .btn-show-all {
    grid-area: btn-show-all;
    @include font($heading-1);

    --font-size: #{rem(12px)};
    --color: var(--gray-500);
    --width: 100%;

    @include media(xs) {
      padding: 0;
      --bg: transparent;

      &:hover {
        --color: var(--white);
      }
    }
  }

  > .arrows {
    grid-area: arrows;

    @include media(xs) {
      margin-left: rem(24px);
    }
  }

  > .title {
    flex-grow: 1;
    grid-area: heading;
    @include font($heading-4);
    color: var(--white);
    margin: 0;
  }

  > .items {
    grid-area: items;
    display: var(--display, flex);
    align-items: center;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: rem(11px) 0;
    margin: 0 rem(-8px);

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
