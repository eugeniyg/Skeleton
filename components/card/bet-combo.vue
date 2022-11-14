<template>
  <div class="card-bet-combo" :class="{'is-open': isOpen}">
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
        <button class="btn-toggle-expand" @click="isOpen = !isOpen">
          <atomic-icon id="ui-arrow_expand-close"/>
        </button>

        <div class="row-title">{{ betCard.comboLabel }}</div>

        <div class="more-group">
          <span class="type">{{ props.items[0].discipline }}</span>

          <div v-if="comboDisciplines.length" class="tooltip" data-tooltip-parent>
            <span class="more">{{ `+${comboDisciplines.length} ${betCard.comboDisciplinesTooltip}` }}</span>
            <atomic-tooltip :text="comboDisciplines.join(', ')"/>
          </div>
        </div>
      </div>

      <div class="items">
        <span class="label">{{ `${props.items.length} ${betCard.comboBetsLabel}` }}</span>
        <span class="sep" />
        <span class="label">{{ betCard.coefficientLabel }}</span>
        <span class="value">{{ props.coefficient }}</span>
        <span class="sep" />
        <span class="label">{{ betCard.betLabel }}</span>
        <span class="value">{{ betSum }}</span>
      </div>

      <atomic-bet-status
        v-if="props.status !== 1 && betStatusName"
        :variant="betStatusName"
      >
        {{ props.statuses[betStatusName] }}
      </atomic-bet-status>

      <div v-if="props.status !== 1" class="amount">
        <span class="label">{{ betCard.resultLabel }}</span>
        <span class="value">{{ resultSum }}</span>
      </div>
    </div>

    <div class="expand-content">
      <div v-for="(betItem, itemIndex) in props.items" :key="itemIndex" class="item">
        <div class="row">
          <span class="type">{{ betItem.discipline }}</span>
          <span class="sep" />
          <span class="desc">{{ betItem.event }}</span>
          <span class="date">
            <span>{{ formatDate(betItem.eventDate) }}</span>
          </span>
        </div>

        <div class="row-skip">
          <div class="title">{{ betItem.outcome }}</div>

          <div class="column">
            <span class="label">{{ betItem.market }}</span>
            <span class="sep" />
            <span class="label">{{ betCard.coefficientLabel }}</span>
            <span class="value">{{ betItem.coefficient }}</span>
          </div>
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

  const isOpen = ref<boolean>(false);

  const formatDate = (dateUtcIsoString: string, needYear: boolean = true):string => {
    const date = new Date(dateUtcIsoString);
    let dateWithComma;
    if (needYear) dateWithComma = date.toLocaleString('UA').slice(0, -3);
    else dateWithComma = `${date.toLocaleString('UA').slice(0, -15)}${date.toLocaleString('UA').slice(-10, -3)}`;
    return dateWithComma.replace(',', ' ');
  };

  const comboDisciplines = computed(() => {
    const disciplinesArr = props.items.map((betItem) => betItem.discipline).filter((discipline) => discipline !== props.items[0].discipline);
    return disciplinesArr;
  });

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
.card-bet-combo {
  border-radius: 16px;
  padding: var(--card-bet-combo-padding, 0 #{rem(24px)} 0);
  background-color: var(--gray-900);

  @include media(md) {
    --card-bet-combo-padding: 0 #{rem(24px)} 0;
  }

  .label {
    @include font($body-2);
    color: var(--color, var(--gray-400));
  }

  .value {
    @include font($body-2);
    color: var(--color, var(--white));
  }

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
    margin: 0 rem(-24px);
    align-items: center;
    border-bottom: 1px solid var(--gray-700);
    border-radius: 16px 16px 0 0;
  }

  .sep {
    height: rem(16px);
    border-left: 1px solid var(--sep-color, var(--gray-800));
  }

  .row-title {
    @include font($heading-3);
    color: var(--white);
  }

  .content {
    --color-type: var(--gray-400);
    padding: rem(8px) rem(24px) rem(18px);
    background-color: var(--gray-900);
    margin: 0 rem(-24px);
    display: grid;
    grid-row-gap: rem(8px);
    grid-template-columns: repeat(2, 1fr);
    border-radius: 0 0 16px 16px;
    grid-template-areas:
      "row row"
      "items items"
      "status status"
      "amount amount";

    @include media(md) {
      grid-template-areas:
      "row status"
      "items amount";
    }

    .date {
      --color: var(--gray-500);
    }

    .time {
      --color: var(--gray-500);
    }
  }

  .type {
    @include font($heading-1);
    color: var(--color-type, var(--white));
  }

  .desc {
    @include font($body-1);
    color: var(--gray-500);
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    white-space: nowrap;
    display: block;
  }

  .bet-status {
    grid-area: status;
    @include media(md) {
      margin-left: auto;
    }
  }

  .btn-copy__wrap {
    margin-left: auto;
  }

  .row {
    display: flex;
    align-items: center;
    grid-column-gap: rem(8px);
    grid-area: row;
    position: relative;
    white-space: nowrap;

    @include media(md) {
      grid-column-gap: rem(16px);
    }
  }

  .items {
    grid-area: items;
    grid-column-gap: rem(4px);
    display: flex;

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
      height: rem(18px);
      align-self: flex-end;
      margin: 0 rem(8px);
    }
  }

  .amount {
    display: flex;
    grid-column-gap: rem(4px);
    grid-area: amount;

    @include media(md) {
      margin-left: auto;
    }

    .label {
      @include font($body-2);
      color: var(--gray-500);
      align-self: flex-end;
    }

    .value {
      @include font($heading-5);
      color: var(--white);
      transform: translateY(#{rem(2px)});
    }
  }

  .expand-content {
    border-top: var(--expand-content-top-border, none);
    border-bottom: var(--expand-content-bottom-border, none);
    background-color: var(--gray-800);
    padding: var(--expand-padding-y, 0) rem(24px);
    border-radius: var(--expand-content-radius, 0 0 #{rem(16px)} #{16px});
    display: grid;
    height: var(--expand-height, 0);
    overflow: hidden;
    margin: var(--expand-content-margin, 0 #{rem(-24px)});

    @include media(md) {
      --expand-content-top-border: none;
      --expand-content-bottom-border: none;
      --expand-content-radius: #{rem(16px)};
      --expand-content-margin: 0;
      outline: 1px solid var(--expand-outline-color, transparent);

    }

    .item {
      padding: 12px 0;
      overflow: hidden;

      .date {
        display: flex;
        grid-column-gap: rem(4px);
        margin-left: auto;
      }

      + .item {
        border-top: 1px solid var(--gray-700);
      }

      .row .sep {
        display: none;

        @include media(md) {
          display: block;
        }
      }
    }
  }

  .column {
    display: flex;
    margin-left: var(--margin-left-group, 0);
    grid-column-gap: rem(4px);

    --sep-color: var(--gray-700);

    .sep {
      margin: 0 rem(4px);
    }

    @include media(md) {
      --margin-left-group: auto;
    }
  }

  .row-skip {
    display: var(--display-row-skip, grid);
    grid-gap: rem(8px);
    align-items: center;
    grid-column-gap: rem(16px);

    @include media(md) {
      --display-row-skip: flex;
    }
  }

  .title {
    @include font($heading-3);
    margin-top: rem(12px);
    color: var(--white);
  }

  .btn-toggle-expand {
    @extend %skip-btn;
    min-width: rem(20px);
    min-height: rem(20px);
    position: absolute;
    left: rem(4px);
    top: 50%;
    transform: rotateX(180deg) translateX(-100%);
    z-index: 1;

    .icon {
      --color: var(--gray-600)
    }
  }

  &.is-open {
    --expand-padding-y: #{rem(4px)};
    --expand-height: auto;
    --expand-outline-color: var(--yellow-700);
    --expand-content-top-border: 1px solid var(--yellow-700);
    --expand-content-bottom-border: 1px solid var(--yellow-700);

    @include media(md) {
      --card-bet-combo-padding: 0 #{rem(24px)} #{rem(16px)};
    }

    .btn-toggle-expand {
      transform: rotateX(0deg) translateX(-100%);

      .icon {
        --color: var(--yellow-500)
      }
    }
  }

  .more-group {
    display: flex;
    align-items: center;
    grid-column-gap: rem(4px);

    .more {
      @include font($body-0);
      color: var(--more-color, var(--gray-400));
      border-bottom: 1px dashed var(--more-border-color, var(--gray-500));
      transition: all .2s ease-in-out;
    }

    .message {
      left: auto;
      right: auto;
      transform: translateX(-50%) translateY(-100%);
      width: auto;
      white-space: nowrap;
    }

    .tooltip {
      display: flex;
      grid-column-gap: rem(4px);
      align-items: center;
      width: fit-content;

      &:hover {
        cursor: pointer;
        --more-color: var(--yellow-500);
        --more-border-color: var(--yellow-500);

        .icon {
          --color: var(--yellow-500);
        }
      }
    }
  }
}
</style>
