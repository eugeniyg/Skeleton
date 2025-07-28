<template>
  <div>
    <div class="nav-tabs">
      <div
        class="nav-tabs__item"
        :class="{ 'is-active': selectedTab === 'cashBonuses' }"
        @click="changeTab('cashBonuses')"
      >
        {{ props.content?.cashBonusTab }}
      </div>

      <div class="nav-tabs__item" :class="{ 'is-active': selectedTab === 'freeSpins' }" @click="changeTab('freeSpins')">
        {{ props.content?.freeSpinsTab }}
      </div>
    </div>

    <table-bonuses-history
      v-if="state.bonusesData.length"
      v-bind="state"
      :content="props.content"
      @change-page="changePage"
    />

    <atomic-empty
      v-else-if="!state.bonusesData.length && !state.loading"
      variant="bonuses"
      :title="props.content?.empty.title"
      :sub-title="props.content?.empty.description"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerBonus, IPaginationMeta, IPlayerFreeSpin, IPlayerBonusesRequest } from '@skeleton/api/types';
  import type { IBonusesHistory } from '~/types';
  import { getPlayerBonuses, getPlayerFreeSpins } from '@skeleton/api/bonuses';

  const props = defineProps<{
    content: IBonusesHistory;
  }>();

  interface IState {
    loading: boolean;
    tableType: 'cashBonuses' | 'freeSpins';
    bonusesData: IPlayerBonus[] | IPlayerFreeSpin[];
    bonusesMeta: Maybe<IPaginationMeta>;
  }

  const state = reactive<IState>({
    loading: true,
    tableType: 'cashBonuses',
    bonusesData: [],
    bonusesMeta: undefined,
  });

  const selectedTab = ref<'cashBonuses' | 'freeSpins'>('cashBonuses');

  const getBonusesData = async (page = 1): Promise<void> => {
    state.loading = true;
    const requestParams: IPlayerBonusesRequest = {
      page,
      perPage: 10,
      sortOrder: 'desc',
    };

    try {
      const { data, meta } =
        selectedTab.value === 'cashBonuses'
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

  const changePage = async (page: number): Promise<void> => {
    if (state.loading) return;
    window.scroll(0, 0);
    await getBonusesData(page);
  };

  const changeTab = async (tabId: 'cashBonuses' | 'freeSpins'): Promise<void> => {
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
