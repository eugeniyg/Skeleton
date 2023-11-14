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
          <atomic-icon id="arrow_expand-close"/>
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
        v-if="props.status !== 1"
        :variant="props.status"
      >
        {{ getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, `constants.betStatuses.${props.status}`) }}
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
import type { IBetItem } from '@skeleton/core/types';
import type { IBetsHistory } from '~/types';

const props = defineProps<{
    id: string,
    amount: number,
    currency: string,
    createdAt: string,
    payout: number,
    items: IBetItem[],
    status: number,
    coefficient: number,
    betCard: IBetsHistory['betCard'],
  }>();

  const isOpen = ref<boolean>(false);

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();

  const formatDate = (dateUtcIsoString: string, needYear: boolean = true):string => {
    const date = new Date(dateUtcIsoString);
    let dateWithComma;
    if (needYear) dateWithComma = date.toLocaleString('UA').slice(0, -3);
    else dateWithComma = `${date.toLocaleString('UA').slice(0, -15)}${date.toLocaleString('UA').slice(-10, -3)}`;
    return dateWithComma.replace(',', ' ');
  };

  const comboDisciplines = computed(() => {
    return props.items.map((betItem) => betItem.discipline).filter((discipline) => discipline !== props.items[0].discipline);
  });

  const { formatBalance, getContent } = useProjectMethods();
  const betSum = computed(() => {
    const balanceFormat = formatBalance(props.currency, props.amount);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  });

  const resultSum = computed(() => {
    const balanceFormat = formatBalance(props.currency, props.payout);
    return `${balanceFormat.amount} ${balanceFormat.currency}`;
  });
</script>

<style src="~/assets/styles/components/card/bet-combo.scss" lang="scss" />
