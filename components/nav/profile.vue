<template>
  <nav class="nav-profile" :class="{'is-open': isOpen}" v-click-outside="close">
    <button class="selected" @click="toggle">
      {{ selected?.title }}<atomic-icon id="arrow_expand-close"/>
    </button>

    <div class="items">
      <router-link
        v-for="(item, index) in sortedMenu"
        @click="close"
        :key="index"
        class="item"
        :class="{'is-active': route.path === localizePath(item.url)}"
        :to="localizePath(item.url)"
      >
        {{ item.title }}

        <client-only>
          <span v-if="item.id === 'bonuses' && activeBonusesAndFreeSpins" class="count">
            {{ activeBonusesAndFreeSpins }}
          </span>
        </client-only>

        <template v-if="route.path === localizePath(item.url)">
          <atomic-icon id="check"/>
        </template>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPageMeta } from '~/types';

  const props = defineProps<{
    items: { id: string, title: string, url: string, pageMeta: IPageMeta }[]
  }>();

  const sortOrder = [
    'info',
    'wallet',
    'bonuses',
    'security',
    'history',
    'limits'
  ];

  const sortedMenu = computed(() => {
    return [...props.items].sort((prev, next) => {
      const prevIndex = sortOrder.indexOf(prev.id);
      const nextIndex = sortOrder.indexOf(next.id);
      return prevIndex - nextIndex;
    })
  });

  const { localizePath } = useProjectMethods();
  const route = useRoute();
  const isOpen = ref<boolean>(false);
  const selected = computed(() => props.items.find((item:any) => localizePath(item.url) === route.path));

  const bonusStore = useBonusStore();
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);

  const toggle = ():void => {
    isOpen.value = !isOpen.value;
  };

  const close = ():void => {
    if (isOpen.value) isOpen.value = false;
  };

  const activeBonusesAndFreeSpins = computed(() => {
    return (activePlayerBonuses.value?.length || 0) + (activePlayerFreeSpins.value?.length || 0)
  })
</script>

<style src="~/assets/styles/components/nav/profile.scss" lang="scss" />

