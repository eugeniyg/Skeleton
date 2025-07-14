<template>
  <div class="nav-category-sidebar">
    <div v-for="(listItem, index) in props.items" :key="index" class="item">
      <atomic-cta-menu-item
        v-if="props.integratedElement?.isShow && Number(props.integratedElement.order) === index + 1"
        v-bind="props.integratedElement"
      />

      <atomic-cta-menu-item
        v-if="props.integratedElementSecond?.isShow && Number(props.integratedElementSecond.order) === index + 1"
        v-bind="props.integratedElementSecond"
      />

      <atomic-link
        class="link"
        :href="listItem.url"
        :target-blank="listItem.targetBlank"
        :class="{ 'is-active': route.fullPath === localizePath(listItem.url) }"
      >
        <atomic-svg v-if="listItem?.displayCustomIcon && listItem?.customIcon" :src="listItem?.customIcon" />
        <atomic-icon v-else :id="listItem?.icon ? listItem?.icon : 'dot-md'" />

        <div class="text">{{ listItem.label }}</div>
      </atomic-link>

      <list-games
        v-if="listItem.gameList?.length"
        :items="listItem.gameList.map((game: any) => game.gameIdentity).slice(0, 4)"
      />

      <list-sportsbook
        v-if="listItem.sportsbookList?.length"
        :items="listItem.sportsbookList.map((item: any) => item).slice(0, 4)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ISiteSidebar } from '~/types';

  const props = defineProps<{
    items: ISiteSidebar['topMenu']['items'];
    integratedElement?: ISiteSidebar['topMenu']['integratedElement'];
    integratedElementSecond?: ISiteSidebar['topMenu']['integratedElementSecond'];
  }>();

  const route = useRoute();
</script>

<style src="~/assets/styles/components/nav/category-sidebar.scss" lang="scss" />
