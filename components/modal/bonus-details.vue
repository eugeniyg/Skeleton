<template>
  <vue-final-modal
    :model-value="props.showModal"
    class="modal-bonus-details"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="emit('close')"
  >
    <div class="scroll">
      <div class="header">
        <div class="header__title" :class="{ 'header__title--large': !props.bonusInfo?.bonusValue }">
          {{ props.bonusInfo?.name }}
        </div>

        <div v-if="props.bonusInfo?.bonusValue" class="header__value">
          {{ props.bonusInfo.bonusValue }}
        </div>

        <div class="header__row">
          <bonuses-badge-type :mode="props.bonusInfo?.badgeType" />

          <bonuses-timer v-if="props.bonusInfo?.expiredDate" :expired-at="props.bonusInfo.expiredDate" hide-labels />

          <bonuses-badge-status :status="props.bonusInfo?.badgeStatus" />
        </div>

        <button-modal-close @close="emit('close')" />
      </div>

      <div v-if="props.bonusInfo" class="modal-bonus-details__table">
        <bonuses-info-table :key="props.bonusInfo.id" class="modal-bonus-details__dl" :bonus-info="props.bonusInfo" />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';

  const props = defineProps<{
    showModal: boolean;
    bonusInfo?: Record<string, any>;
  }>();

  const emit = defineEmits(['close']);
</script>

<style src="~/assets/styles/components/modal/bonus-details.scss" lang="scss" />
