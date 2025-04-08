<template>
  <div class="tabs-history">
    <div class="nav">
      <div
        v-for="{ title, id } in tabsArray"
        :key="id"
        class="item"
        :class="{ 'is-selected': id === selected }"
        @click="changeTab(id)"
      >
        {{ title }}
      </div>
    </div>

    <div class="tab-history">
      <component :is="tabComponent" :content="props.content[selected]" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IHistory } from '~/types';
  import {
    TabHistoryBets,
    TabHistoryBonuses,
    TabHistorySessions,
    TabHistorySpins,
    TabHistoryTransactions,
  } from '#components';

  const props = defineProps<{
    content: IHistory;
  }>();

  const runtimeConfig = useRuntimeConfig();
  const hasBetsyIntegration =
    runtimeConfig.public.betsyParams?.clientHost && runtimeConfig.public.betsyParams?.clientId;
  const filterContent = Object.keys(props.content).filter(key => {
    if (key === 'bets' && !hasBetsyIntegration) return false;
    if (props.content[key]?.tabLabel) return key;
    return false;
  });

  const sortContent = filterContent.sort((a, b) => {
    if (props.content[a].tabPosition > props.content[b].tabPosition) return 1;
    return -1;
  });

  const tabsArray = sortContent.map(key => ({
    id: key,
    title: props.content[key].tabLabel,
  }));

  const selected = ref<string>(tabsArray[0].id);

  const route = useRoute();
  const router = useRouter();

  if (route.query.tab) {
    selected.value = route.query.tab as string;
  } else {
    router.replace({ query: { tab: tabsArray[0].id } });
  }

  const tabComponent = computed(() => {
    if (selected.value === 'bets') return TabHistoryBets;
    if (selected.value === 'bonuses') return TabHistoryBonuses;
    if (selected.value === 'sessions') return TabHistorySessions;
    if (selected.value === 'spins') return TabHistorySpins;
    if (selected.value === 'transactions') return TabHistoryTransactions;
    return null;
  });

  const changeTab = (tabId: string): void => {
    router.push({ query: { tab: tabId } });
    selected.value = tabId;
  };
</script>

<style src="~/assets/styles/components/tab/history/index.scss" lang="scss" />
