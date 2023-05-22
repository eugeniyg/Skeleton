<template>
  <div>
    <div class="tb-bonuses-history">
      <div class="row">
        <div
          v-for="(columnName, columnIndex) in tableColumns"
          :key="columnIndex"
          class="th"
        >
          {{ columnName }}
        </div>
      </div>

      <div v-for="bonus in props.bonusesData" :key="bonus.id" class="row">
        <div class="td"><span class="bonus-name">{{ bonus.name }}</span></div>
        <div class="td">{{ getBonusFinallyStatus(bonus) }}</div>
        <div class="td">
          {{ formatBalance(bonus.currency, bonus.amount).amount }}
          {{ formatBalance(bonus.currency, bonus.amount).currency }}
        </div>
        <div class="td">{{ bonus.currentWagerPercentage || 0 }}%</div>
        <div class="td" v-html="format(getFormatDate(bonus.createdAt))"/>
        <div class="td" v-html="expiredAtDate(bonus) || '-'"/>
      </div>
    </div>

    <atomic-pagination
      v-if="props.bonusesMeta?.totalPages > 1"
      v-bind="props.bonusesMeta"
      @selectPage="emit('changePage', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { PaginationMetaInterface, PlayerBonusInterface } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';
  import { HistoryBonusesInterface } from '@skeleton/types';

  const props = defineProps<{
    content: HistoryBonusesInterface,
    bonusesData: PlayerBonusInterface[],
    bonusesMeta: Maybe<PaginationMetaInterface>
  }>();

  const emit = defineEmits(['changePage']);

  const tableColumns = Object.values(props.content.tableColumns);

  const globalStore = useGlobalStore();
  const { bonusesStatuses, bonusesResults } = storeToRefs(globalStore);
  const bonusStatusesObj = computed(() => {
    const statusesObj: { [key: number]: string } = {};
    bonusesStatuses.value.forEach((status) => {
      statusesObj[status.id as number] = status.name;
    });
    return statusesObj;
  });

  const bonusResultsObj = computed(() => {
    const resultsObj: { [key: number]: string } = {};
    bonusesResults.value.forEach((result) => {
      resultsObj[result.id as number] = result.name;
    });
    return resultsObj;
  });

  const getBonusFinallyStatus = (bonusInfo: PlayerBonusInterface):string => {
    if ([1, 2].includes(bonusInfo.status)) return bonusStatusesObj.value[bonusInfo.status];
    return bonusResultsObj.value[bonusInfo.result];
  };

  const { getFormatDate, formatBalance } = useProjectMethods();
  const format = (str:string) => str.replace(',', ',</br>');

  const expiredAtDate = (bonusInfo: PlayerBonusInterface) => {
    if (bonusInfo.status === 2) {
      if (bonusInfo.wageringExpiredAt) {
        return format(getFormatDate(bonusInfo.wageringExpiredAt));
      }
      return undefined;
    }

    if (bonusInfo.activationExpiredAt) {
      return format(getFormatDate(bonusInfo.activationExpiredAt));
    }

    if (bonusInfo.wageringExpiredAt) {
      return format(getFormatDate(bonusInfo.wageringExpiredAt));
    }

    return undefined;
  };
</script>

<style lang="scss">
.tb-bonuses-history {
  @extend %tb;
  @extend %scrollbar;
  overflow-x: auto;
  overscroll-behavior: auto;
  padding-bottom: rem(8px);

  .row {
    grid-template-columns:
      minmax(rem(156px), 1fr)
      minmax(rem(105px), 1fr)
      minmax(rem(158px), 1fr)
      minmax(rem(75px), 1fr)
      minmax(rem(100px), 1fr)
      minmax(rem(100px), 1fr);

    .bonus-name {
      overflow: hidden;
      display: -webkit-box;
      overflow-wrap: anywhere;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
