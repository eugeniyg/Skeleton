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
    let dateWithComma;
    if (needYear) dateWithComma = date.toLocaleString('UA').slice(0, -3);
    else dateWithComma = `${date.toLocaleString('UA').slice(0, -15)}${date.toLocaleString('UA').slice(-10, -3)}`;
    return dateWithComma.replace(',', ' ');
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

<style lang="scss">
.card-bet-ordinar {
  border-radius: 16px;

  .date {
    @include font($body-1);
    color: var(--color, var(--gray-400));
  }

  .time {
    @include font($body-1);
    color: var(--color, var(--gray-400));
  }

  .num {
    @include font($heading-2);
    color: var(--color, var(--gray-400));
  }

  .head {
    display: flex;
    grid-column-gap: rem(8px);
    background-color: var(--gray-800);
    padding: rem(11px) rem(24px);
    align-items: center;
    border-bottom: 1px solid var(--gray-700);
    border-radius: 16px 16px 0 0;
  }

  .content {
    padding: rem(8px) rem(24px) rem(18px);
    background-color: var(--gray-900);
    border-radius: 0 0 16px 16px;

    .date {
      --color: var(--gray-500);
    }

    .time {
      --color: var(--gray-500);
    }

    .sep {
      height: rem(16px);
      border-left: 1px solid var(--gray-800);
    }
  }

  .type {
    @include font($heading-1);
    color: var(--white);
  }

  .desc {
    @include font($body-1);
    color: var(--gray-500);
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    white-space: nowrap;
  }

  .status {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
    margin-left: auto;
    white-space: nowrap;
  }

  .btn-copy__wrap {
    margin-left: auto;
  }

  .row {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
    white-space: nowrap;

    @include media(md) {
      grid-column-gap: rem(16px);
    }
  }

  .items {
    display: flex;
    grid-column-gap: rem(4px);
    flex-wrap: wrap;

    .label {
      @include font($body-2);
      color: var(--gray-500);
      align-self: flex-end;
    }

    .value {
      @include font($body-2);
      color: var(--white);
      align-self: flex-end;
    }

    .sep {
      border-left: 1px solid var(--gray-700);
      height: 18px;
      align-self: flex-end;
      margin: 0 rem(8px);
    }
  }

  .amount {
    display: flex;
    grid-column-gap: rem(4px);
    //grid-area: amount;
    width: 100%;

    @include media(md) {
      margin-left: auto;
      width: auto;
    }

    .label {
      @include font($body-2);
      color: var(--gray-500);
      align-self: flex-end;
      padding-bottom: 2px;
    }

    .value {
      @include font($heading-5);
      color: var(--white);
    }
  }

  .title {
    @include font($heading-3);
    margin: rem(12px) 0 rem(8px);
    color: var(--white);
  }
}
</style>
