<template>
  <div class="tab-history__tb" v-if="spins.length">
    <div class="tb-spins-history">
      <div class="row">
        <div
          v-for="(column, itemIndex) in headTitles"
          :key="itemIndex"
          class="th"
        >
          {{ column }}
        </div>
      </div>

      <template v-if="spins.length">
        <div v-for="(spin, itemIndex) in spins" :key="itemIndex" class="row">
          <div class="td">{{ spin.game}}</div>
          <div class="td">{{ formatSum(spin.currency, spin.betAmount) }}</div>
          <div class="td">{{ formatSum(spin.currency, spin.resultBalance) }}</div>
          <div class="td">{{ getFormatDate(spin.createdAt) }}</div>
        </div>
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
    :title="props.content.spins.empty.title"
    :subTitle="props.content.spins.empty.description"
  />
</template>

<script setup lang="ts">
  import { PaginationMetaInterface, SpinHistoryInterface } from '@platform/frontend-core/dist/module';
  import { HistoryTabInterface } from '~/types';

  const props = defineProps<{
    content: HistoryTabInterface,
  }>();

  const headTitles = Object.values(props.content.spins.tableColumns || {});
  const loading = ref<boolean>(true);
  const spins = ref<SpinHistoryInterface[]>([]);
  const pageMeta = ref<PaginationMetaInterface>();

  const { getSpinsHistory } = useCoreGamesApi();
  const spinsRequest = async (page: number = 1):Promise<void> => {
    loading.value = true;
    const response = await getSpinsHistory(page, 10);
    spins.value = response.data;
    pageMeta.value = response.meta;
    loading.value = false;
  };

  const { getFormatDate } = useProjectMethods();

  const changePage = (page: number):void => {
    if (loading.value) return;
    window.scroll(0, 0);
    spinsRequest(page);
  };

  const { formatBalance } = useProjectMethods();
  const formatSum = (currency: string, amount: number):string => {
    const balanceFormat = formatBalance(currency, amount);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  };

  onMounted(() => { spinsRequest(); });
</script>

<style lang="scss">
.tb-spins-history {
  @extend %tb;
  @extend %scrollbar;
  overflow-x: auto;
  overscroll-behavior: auto;
  padding-bottom: rem(8px);

  .row {
    grid-template-columns:
      minmax(rem(152px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(100px), 1fr);

    @include media(md) {
      grid-template-columns:
      minmax(rem(278px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(100px), 1fr)
    }
  }
}
</style>
