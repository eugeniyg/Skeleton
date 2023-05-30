<template>
  <div>
    <!--
    <div class="nav-tabs">
      <div
        class="nav-tabs__item"
        v-for="{ title, id } in tabs"
        :key="id"
        :class="{'is-active': id === selectedTab}"
        @click="changeTab(id)"
      >
        {{ title }}
      </div>
    </div>
        -->

    <table-bonuses-history
      v-if="state.bonusesData.length"
      v-bind="state"
      :content="bonusesContent"
      @changePage="changePage"
    />

    <atomic-empty
      v-else-if="!state.loading"
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
    bonusesData: PlayerBonusInterface[],
    bonusesMeta: Maybe<PaginationMetaInterface>
  }

  const state = reactive<StateInterface>({
    loading: true,
    bonusesData: [],
    bonusesMeta: undefined,
  });

  const { getPlayerBonuses } = useCoreBonusApi();
  const getBonusesData = async (page = 1):Promise<void> => {
    state.loading = true;

    try {
      const { data, meta } = await getPlayerBonuses({
        page,
        perPage: 10,
        sortOrder: 'desc',
      });
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

  // const tabs = [
  //   {
  //     title: 'Cash Bonuses',
  //     id: 'cash-bonuses',
  //   },
  //   {
  //     title: 'Free spins',
  //     id: 'free-spins',
  //   },
  // ];

  // const selectedTab = ref<string>(tabs[0].id);
  //
  // const changeTab = (tabId: string): void => {
  //   if (selectedTab.value === tabId) return;
  //   selectedTab.value = tabId;
  // };

  onMounted(async () => {
    await getBonusesData();
  });
</script>

<style src="~/assets/styles/components/tab/history/bonuses.scss" lang="scss" />

