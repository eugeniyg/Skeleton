<template>
  <div class="card-bet-ordinar">
    <div class="head">
      <span class="date">{{ dayjs(props.createdAt).format('DD.MM HH:mm') }}</span>

      <button-copy :copy-button="betCard.copyButton" :copy-tooltip="betCard.copyTooltip" :text="props.roundId" />
    </div>

    <div class="content">
      <div class="row">
        <span class="type">{{ betItem.discipline }}</span>
        <span class="sep" />
        <span class="desc">{{ betItem.event }}</span>

        <div class="status">
          <span class="date">{{ dayjs(betItem.eventDate).format('DD.MM.YYYY HH:mm') }}</span>

          <template v-if="props.status !== 1">
            <span class="sep" />
            <atomic-bet-status :variant="props.status">
              {{
                getContent(
                  globalComponentsContent,
                  defaultLocaleGlobalComponentsContent,
                  `constants.betStatuses.${props.status}`
                )
              }}
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
  import type { IBetItem } from '@skeleton/api/types';
  import type { IBetsHistory } from '~/types';
  import { formatBalance } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    id: string;
    roundId: string;
    amount: number;
    currency: string;
    createdAt: string;
    payout: number;
    items: IBetItem[];
    status: number;
    coefficient: number;
    betCard: IBetsHistory['betCard'];
  }>();

  const betItem = props.items[0];
  const dayjs = useDayjs();
  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
  const betSum = computed(() => {
    const balanceFormat = formatBalance(props.currency, props.amount);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  });

  const resultSum = computed(() => {
    const balanceFormat = formatBalance(props.currency, props.payout);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  });
</script>

<style src="~/assets/styles/components/card/bet-ordinar.scss" lang="scss" />
