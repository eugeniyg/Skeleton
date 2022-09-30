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
          <span class="sep" />

          <atomic-bet-status
            v-if="props.status !== 1 && betStatusName"
            :variant="betStatusName"
          >
            {{ props.statuses[betStatusName] }}
          </atomic-bet-status>
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
  import { BetCardInterface, BetStatusesInterface } from '~/types';

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
    if (needYear) return date.toLocaleString().slice(0, -3);
    return `${date.toLocaleString().slice(0, -15)}${date.toLocaleString().slice(-10, -3)}`;
  };

  const { betStatuses } = useCoreStore();
  const betStatusName = betStatuses.find((status) => status.id === props.status)?.name;

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

<style lang="scss" src="./style.scss"/>
