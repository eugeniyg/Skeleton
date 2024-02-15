<template>
  <div class="tab-history__tb">
    <div class="cards-bet-tab">
      <div class="nav-bets-history">
        <div
          class="item"
          v-for="{ title, id } in betsTab"
          :key="id"
          :class="{'is-active': id === selectedBetsTab}"
          @click="changeBetsTab(id)"
        >
          {{ title }}
        </div>
      </div>

      <atomic-empty
        v-if="!loading && !bets.length"
        variant="bets-history"
        :title="props.content?.empty?.title"
        :subTitle="props.content?.empty?.description"
      />

      <template v-for="betItem in bets" :key="betItem.id">
        <card-bet-combo
          v-if="betItem.items?.length > 1"
          v-bind="{ ...betItem, ...props.content }"
        />

        <card-bet-ordinar
          v-else
          v-bind="{ ...betItem, ...props.content }"
        />
      </template>
    </div>

    <atomic-pagination
      v-if="pageMeta?.totalPages && pageMeta.totalPages > 1"
      v-bind="pageMeta"
      @selectPage="changePage"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IBetHistory, IPaginationMeta } from '@skeleton/core/types';
  import type { IBetsHistory } from '~/types';

  const props = defineProps<{
    content: IBetsHistory,
  }>();

  const loading = ref<boolean>(true);
  const bets = ref<IBetHistory[]>([]);
  const pageMeta = ref<IPaginationMeta>();

  const betsTab = [
    {
      title: props.content?.settledTab || 'Settled',
      id: 'settled',
    },
    {
      title: props.content?.unsettledTab || 'Unsettled',
      id: 'unsettled',
    },
  ];
  const selectedBetsTab = ref<string>(betsTab[0].id);

  const { getBetsHistory } = useCoreGamesApi();
  const betsRequest = async (page: number = 1):Promise<void> => {
    loading.value = true;
    const response = await getBetsHistory(page, 10, selectedBetsTab.value === 'settled');
    bets.value = response.data;
    pageMeta.value = response.meta;
    loading.value = false;
  };

  const changeBetsTab = (tabId: string):void => {
    if (selectedBetsTab.value === tabId) return;
    selectedBetsTab.value = tabId;
    betsRequest();
  };

  const changePage = (page: number):void => {
    if (loading.value) return;
    window.scroll(0, 0);
    betsRequest(page);
  };

  onMounted(() => { betsRequest(); });
</script>

<style src="~/assets/styles/components/tab/history/bets.scss" lang="scss" />

