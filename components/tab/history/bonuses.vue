<template>
  <div>
    <div class="nav-tabs">
      <div
        class="nav-tabs__item"
        :class="{'is-active':  selectedTab === 'cashBonuses'}"
        @click="changeTab('cashBonuses')"
      >
        {{ bonusesContent.cashBonusTab }}
      </div>

      <div
        class="nav-tabs__item"
        :class="{'is-active': selectedTab === 'freeSpins'}"
        @click="changeTab('freeSpins')"
      >
        {{ bonusesContent.freeSpinsTab }}
      </div>
    </div>

    <table-bonuses-history
      v-if="state.bonusesData.length"
      v-bind="state"
      :content="bonusesContent"
      @changePage="changePage"
    />

    <atomic-empty
      v-else-if="!state.bonusesData.length && !state.loading"
      variant="bonuses"
      :title="bonusesContent.empty.title"
      :subTitle="bonusesContent.empty.description"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    PlayerBonusInterface,
    PaginationMetaInterface,
  } from '@platform/frontend-core/dist/module';
  import { HistoryBonusesInterface, HistoryTabInterface } from '@skeleton/types';

  const props = defineProps<{
    content: HistoryTabInterface,
  }>();

  const bonusesContent:HistoryBonusesInterface = props.content.bonuses;

  interface StateInterface {
    loading: boolean,
    tableType: 'cashBonuses'|'freeSpins',
    bonusesData: PlayerBonusInterface[],
    bonusesMeta: Maybe<PaginationMetaInterface>
  }

  const state = reactive<StateInterface>({
    loading: true,
    tableType: 'cashBonuses',
    bonusesData: [],
    bonusesMeta: undefined,
  });

  const selectedTab = ref<'cashBonuses'|'freeSpins'>('cashBonuses');

  const { getPlayerBonuses, getPlayerFreeSpins } = useCoreBonusApi();
  const getBonusesData = async (page = 1):Promise<void> => {
    state.loading = true;
    const requestParams = {
      page,
      perPage: 10,
      sortOrder: 'desc',
    }

    try {
      const { data, meta } = selectedTab.value === 'cashBonuses'
        ? await getPlayerBonuses(requestParams)
        : await getPlayerFreeSpins(requestParams);

      state.bonusesData = data;
      state.bonusesMeta = meta;
    } catch {
      state.bonusesData = [];
      state.bonusesMeta = undefined;
    }

    state.loading = false;
  };

  const changePage = async (page: number):Promise<void> => {
    if (state.loading) return;
    window.scroll(0, 0);
    await getBonusesData(page);
  };

  const changeTab = async (tabId: 'cashBonuses'|'freeSpins'): Promise<void> => {
    if (selectedTab.value === tabId) return;
    selectedTab.value = tabId;
    await getBonusesData();
    state.tableType = tabId;
  };

  onMounted(async () => {
    await getBonusesData();
  });
</script>

<style src="~/assets/styles/components/tab/history/bonuses.scss" lang="scss" />

