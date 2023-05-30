<template>
  <div class="card-bet-ordinar">
    <div class="head">
      <span class="date">{{ formatDate(props.createdAt, false) }}</span>

      <button-copy
        :copyButton="betCard.copyButton"
        :copyTooltip="betCard.copyTooltip"
        :text="props.id"
      />
    </div>

    <div class="content">
      <div class="row">
        <span class="type">{{ betItem.discipline }}</span>
        <span class="sep" />
        <span class="desc">{{ betItem.event }}</span>

        <div class="status">
          <span class="date">{{ formatDate(betItem.eventDate) }}</span>

          <template v-if="props.status !== 1 && betStatusName">
            <span class="sep" />
            <atomic-bet-status
              :variant="betStatusName"
            >
              {{ props.statuses[betStatusName] }}
            </atomic-bet-status>
          </template>
        </div>
      </div>

      <div class="title">{{ betItem.outcome }}</div>

      <div class="items">
        <span class="label">{{ betItem.market }}</span>
        <span class="sep" />
        <span class="label">{{ betCard.coefficientLabel }}</span>
        <span class="value">{{ betItem.coefficient }}</span>
        <span class="sep" />
        <span class="label">{{ betCard.betLabel }}</span>
        <span class="value">{{ betSum }}</span>
        <span class="pusher" />

        <div v-if="props.status !== 1" class="amount">
          <span class="label">{{ betCard.resultLabel }}</span>
          <span class="value">{{ resultSum }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BetItemInterface } from '@platform/frontend-core/dist/module';
  import { BetCardInterface, BetStatusesInterface } from '@skeleton/types';

  const props = defineProps<{
    id: string,
    betAmount: number,
    currency: string,
    createdAt: string,
    resultBalance: number,
    items: BetItemInterface[],
    status: number,
    coefficient: number,
    statuses: BetStatusesInterface,
    betCard: BetCardInterface,
  }>();

  const betItem = props.items[0];

  const formatDate = (dateUtcIsoString: string, needYear: boolean = true):string => {
    const date = new Date(dateUtcIsoString);
    let dateWithComma;
    if (needYear) dateWithComma = date.toLocaleString('UA').slice(0, -3);
    else dateWithComma = `${date.toLocaleString('UA').slice(0, -15)}${date.toLocaleString('UA').slice(-10, -3)}`;
    return dateWithComma.replace(',', ' ');
  };

  const globalStore = useGlobalStore();
  const findStatus = globalStore.betStatuses.find((status) => status.id === props.status)?.name;
  const betStatusName = findStatus ? findStatus.toLowerCase() : undefined;

  const { formatBalance } = useProjectMethods();
  const betSum = computed(() => {
    const balanceFormat = formatBalance(props.currency, props.betAmount);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  });

  const resultSum = computed(() => {
    const balanceFormat = formatBalance(props.currency, props.resultBalance);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  });
</script>

<style src="~/assets/styles/components/card/bet-ordinar.scss" lang="scss" />

