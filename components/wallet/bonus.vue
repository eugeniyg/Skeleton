<template>
  <div
    class="wallet-bonus"
    :class="{
      [`wallet-bonus--bg-${mappingBonusColor[props.id]}`]: props.selected,
      'is-selected': props.selected
    }"
  >
    <div class="wallet-bonus__content">
      <div class="wallet-bonus__title" v-html="marked.parse(props.title)"/>

      <div
        v-if="props.min"
        class="wallet-bonus__min"
        @click="showModal('walletBonusDetails')"
      >
        <atomic-icon id="info" />

        <div class="wallet-bonus__min-title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.minAmount') }}
        </div>

        <div class="wallet-bonus__min-value">{{ props.min }}</div>
      </div>

      <div
        v-else
        class="wallet-bonus__more"
        @click="showModal('walletBonusDetails')"
      >
        <div class="wallet-bonus__more-title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'wallet.deposit.bonuses.moreInfo') }}
        </div>

        <atomic-icon id="info"/>
      </div>

      <form-input-checkbox
        :name="`${props.id}`"
        :value="props.selected"
        @change="emit('bonusChange', props.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { marked } from 'marked';

  const { showModal } = useLayoutStore();

  const props = defineProps({
    background: {
      type: String,
      required: false,
      validator: (val: string) => ['red', 'orange', 'green', 'violet'].includes(val)
    },
    title: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true
    },
    min: {
      type: String,
      required: false,
    },
    info: {
      type: String,
      required: false,
    },
    selected: {
      type: Boolean
    },
  });

  const emit = defineEmits(['bonusChange']);

  const { getContent } = useProjectMethods();
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();

  const mappingBonusColor = {
    1: 'green',
    2: 'red',
    3: 'orange',
    4: 'violet'
  }
</script>

<style src="~/assets/styles/components/wallet/bonus.scss" lang="scss"/>