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
        <div class="td" v-html="formatDateStr(dayjs(bonus.createdAt).format(dateFormat))"/>
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
  import dayjs from "dayjs";

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

  const { formatBalance } = useProjectMethods();
  const dateFormat = 'DD.MM.YYYY, HH:mm';
  const formatDateStr = (str:string) => str.replace(',', ',</br>');

  const expiredAtDate = (bonusInfo: PlayerBonusInterface) => {
    if (bonusInfo.status === 2) {
      if (bonusInfo.wageringExpiredAt) {
        return formatDateStr(dayjs(bonusInfo.wageringExpiredAt).format(dateFormat));
      }
      return undefined;
    }

    if (bonusInfo.activationExpiredAt) {
      return formatDateStr(dayjs(bonusInfo.activationExpiredAt).format(dateFormat));
    }

    if (bonusInfo.wageringExpiredAt) {
      return formatDateStr(dayjs(bonusInfo.wageringExpiredAt).format(dateFormat));
    }

    return undefined;
  };
</script>

<style src="~/assets/styles/components/table/bonuses-history.scss" lang="scss" />

