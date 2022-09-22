<template>
  <div v-if="groupTurboContent?.items?.length" class="group-turbo">
    <atomic-icon v-if="groupTurboContent?.icon" :id="groupTurboContent.icon"/>

    <h2 class="title">{{ groupTurboContent?.label }}</h2>

    <button-base
      class="btn-show-all"
      type="ghost"
      :url="localizePath('/games?category=turbogames')"
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

      <div class="load-more" ref="loadMore"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { TurbogamesGroupInterface, CardsGroupInterface } from '~/types';

  const { globalComponentsContent } = useGlobalStore();
  const groupTurboContent:TurbogamesGroupInterface|undefined = globalComponentsContent?.turbogames;
  const groupCardContent:CardsGroupInterface|undefined = globalComponentsContent?.cardsGroup;

  const { localizePath } = useProjectMethods();

  const scrollContainer = ref();
  const prevDisabled = ref<boolean>(true);
  const nextDisabled = ref<boolean>(false);
  const showArrowButtons = ref<boolean>(true);

  const scrollHandler = ():void => {
    if (!scrollContainer.value) return;
    const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer.value;
    prevDisabled.value = scrollLeft === 0;
    nextDisabled.value = scrollWidth === Math.floor(scrollLeft) + offsetWidth;
  };

  const clickAction = (direction: string):void => {
    const { offsetWidth } = scrollContainer.value;
    scrollContainer.value.scrollBy({
      left: direction === 'next' ? offsetWidth : -offsetWidth,
      behavior: 'smooth',
    });
  };

  onMounted(() => {
    // TODO CLEAR TIMEOUT AFTER FIX A BUG https://github.com/nuxt/framework/issues/3587
    setTimeout(() => {
      scrollHandler();
      showArrowButtons.value = !prevDisabled.value || !nextDisabled.value;
    }, 100);
  });
</script>

<style lang="scss" src="./style.scss"/>
