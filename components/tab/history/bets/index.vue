<template>
  <div class="tab-history__tb" v-if="bets.length">
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

      <template v-for="betItem in bets" :key="betItem.id">
        <card-bet-combo v-if="betItem.items?.length > 1" v-bind="{ ...betItem, ...betsContent }" />
        <card-bet-ordinar v-else v-bind="{ ...betItem, ...betsContent }" />
      </template>
    </div>

    <atomic-pagination
      v-if="pageMeta?.totalPages > 1"
      v-bind="pageMeta"
      @selectPage="changePage"
    />
  </div>

  <atomic-empty
    v-else-if="!loading"
    variant="bets-history"
    :title="props.content.bets.empty.title"
    :subTitle="props.content.bets.empty.description"
  />
</template>

<script setup lang="ts">
  import { BetHistoryInterface, PaginationMetaInterface } from '@platform/frontend-core/dist/module';
  import { HistoryBetsInterface, HistoryTabInterface } from '~/types';

  const props = defineProps<{
    content: HistoryTabInterface,
  }>();

  const loading = ref<boolean>(true);
  const bets = ref<BetHistoryInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();
  const betsContent:HistoryBetsInterface|undefined = props.content?.bets;

  const betsTab = [
    {
      title: betsContent?.settledTab || 'Settled',
      id: 'settled',
    },
    {
      title: betsContent?.unsettledTab || 'Unsettled',
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    betsRequest(page);
  };

  onMounted(() => { betsRequest(); });
</script>

<style lang="scss" src="./style.scss"/>
