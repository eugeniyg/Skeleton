<template>
  <div v-if="spins.length" class="tab-history__tb">
    <div class="tb-spins-history">
      <div class="row">
        <div v-for="(column, itemIndex) in headTitles" :key="itemIndex" class="th">
          {{ column }}
        </div>
      </div>

      <template v-if="spins.length">
        <div v-for="(spin, itemIndex) in spins" :key="itemIndex" class="row">
          <div class="td">
            <atomic-link class="tb-spins-history__game-link" :href="`/games/${spin.gameIdentity}?real=true`">
              {{ spin.game }}
            </atomic-link>
          </div>
          <div class="td">{{ formatSum(spin.currency, spin.amount) }}</div>
          <div class="td">{{ formatSum(spin.currency, spin.payout) }}</div>
          <div class="td">{{ dayjs(spin.createdAt).format('DD.MM.YYYY, HH:mm') }}</div>
        </div>
      </template>
    </div>

    <atomic-pagination
      v-if="pageMeta?.totalPages && pageMeta.totalPages > 1"
      v-bind="pageMeta"
      @select-page="changePage"
    />
  </div>

  <atomic-empty
    v-else-if="!loading"
    variant="bets-history"
    :title="props.content?.empty?.title"
    :sub-title="props.content?.empty?.description"
  />
</template>

<script setup lang="ts">
  import type { IPaginationMeta, ISpinHistory } from '@skeleton/api/types';
  import type { ISpinsHistory } from '~/types';
  import { getSpinsHistory } from '@skeleton/api/games';
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    content: ISpinsHistory;
  }>();

  const dayjs = useDayjs();
  const headTitles = Object.values(props.content?.tableColumns || {});
  const loading = ref<boolean>(true);
  const spins = ref<ISpinHistory[]>([]);
  const pageMeta = ref<IPaginationMeta>();

  const spinsRequest = async (page: number = 1): Promise<void> => {
    loading.value = true;
    const response = await getSpinsHistory(page, 10);
    spins.value = response.data;
    pageMeta.value = response.meta;
    loading.value = false;
  };

  const changePage = (page: number): void => {
    if (loading.value) return;
    window.scroll(0, 0);
    spinsRequest(page);
  };

  const formatSum = (currency: string, amount: number): string => {
    const balanceFormat = formatBalance(currency, amount);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  };

  onMounted(() => {
    spinsRequest();
  });
</script>

<style src="~/assets/styles/components/tab/history/spins.scss" lang="scss" />
