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
        <div class="td">
          <span class="bonus-name">{{ bonus.name }}</span>
        </div>

        <div class="td">
          {{ props.tableType === 'cashBonuses' ? getBonusFinallyStatus(bonus) : getFreeSpinFinallyStatus(bonus) }}
        </div>

        <div class="td">
          <template v-if="props.tableType === 'cashBonuses'">
            {{ formatBalance(bonus.currency, bonus.amount).amount }}
            {{ formatBalance(bonus.currency, bonus.amount).currency }}
          </template>

          <template v-else>
            {{ bonus.count }} FS
          </template>
        </div>
        <div class="td">
          <template v-if="props.tableType === 'cashBonuses'">
            {{ Number((bonus.currentWagerPercentage || 0).toFixed(2)) }}%
          </template>

          <template v-else>
            {{ bonus.usedCount}}/{{ bonus.count }}
          </template>
        </div>
        <div class="td" v-html="formatDateStr(dayjs(props.tableType === 'cashBonuses' ? bonus.createdAt : bonus.issuedAt).format(dateFormat))"/>
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
  import {PlayerFreeSpinInterface} from "@platform/frontend-core";

  const props = defineProps<{
    content: HistoryBonusesInterface,
    tableType: 'cashBonuses'|'freeSpins',
    bonusesData: PlayerBonusInterface[]|PlayerFreeSpinInterface[],
    bonusesMeta: Maybe<PaginationMetaInterface>,
  }>();

  const emit = defineEmits(['changePage']);
  const tableColumns = Object.values(props.content.tableColumns);

  const globalStore = useGlobalStore();
  const {
    bonusesStatuses,
    bonusesResults,
    freeSpinsStatuses,
    freeSpinsResults
  } = storeToRefs(globalStore);
  const bonusStatusesObj = computed(() => {
    const statusesObj: { [key: number]: string } = {};
    bonusesStatuses.value.forEach((status) => {
      statusesObj[status.id as number] = status.name;
    });
    return statusesObj;
  });

  const freeSpinsStatusesObj = computed(() => {
    const statusesObj: { [key: number]: string } = {};
    freeSpinsStatuses.value.forEach((status) => {
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

  const freeSpinsResultsObj = computed(() => {
    const resultsObj: { [key: number]: string } = {};
    freeSpinsResults.value.forEach((result) => {
      resultsObj[result.id as number] = result.name;
    });
    return resultsObj;
  });

  const getBonusFinallyStatus = (bonusInfo: PlayerBonusInterface):string => {
    if ([1, 2].includes(bonusInfo.status)) return bonusStatusesObj.value[bonusInfo.status];
    return bonusResultsObj.value[bonusInfo.result];
  };

  const getFreeSpinFinallyStatus = (freeSpinInfo: PlayerFreeSpinInterface|PlayerBonusInterface):string => {
    if ([1, 2].includes(freeSpinInfo.status)) return freeSpinsStatusesObj.value[freeSpinInfo.status];
    return freeSpinsResultsObj.value[freeSpinInfo.result];
  };

  const { formatBalance } = useProjectMethods();
  const dateFormat = 'DD.MM.YYYY, HH:mm';
  const formatDateStr = (str:string) => str.replace(',', ',</br>');

  const expiredAtDate = (bonusInfo: PlayerBonusInterface|PlayerFreeSpinInterface) => {
    if (bonusInfo.expiredAt) return formatDateStr(dayjs(bonusInfo.expiredAt).format(dateFormat));

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

