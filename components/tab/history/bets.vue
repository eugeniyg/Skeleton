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
        :title="props.content.bets.empty.title"
        :subTitle="props.content.bets.empty.description"
      />

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

<style lang="scss">
.cards-bet-tab {
  display: grid;
  grid-row-gap: rem(8px);
  align-items: flex-start;

  .nav-bets-history {
    display: flex;
    background-color: var(--gray-800);
    border: 4px solid var(--gray-800);
    border-radius: 999px;
    margin-bottom: 8px;

    .item {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 32px;
      @include font($body-1);
      padding: rem(2px);
      border-radius: 999px;
      background-color: var(--bg, inherit);
      color: var(--color, inherit);
      transition: all .2s ease-in-out;
      grid-column-gap: rem(4px);
      --color: var(--gray-300);

      &:hover {
        cursor: pointer;
      }

      &.is-active {
        --bg: var(--gray-700);
        --color: var(--white) !important;
      }
    }
  }
}
</style>
