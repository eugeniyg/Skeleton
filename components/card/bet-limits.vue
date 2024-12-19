<template>
  <div class="limits__card" :class="{ 'is-full-width': isFullWidth }">
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ getContent(limitsContent, defaultLimitsContent, 'bet.label') }}
      <atomic-tooltip
        v-if="betPeriods.length"
        :text="getContent(limitsContent, defaultLimitsContent, 'bet.hint')"
        align="bottom"
      />
    </h4>

    <atomic-limits-periods-list v-if="betPeriods.length" :periods="betPeriods" :is-show-edit="state.isShowEdit" />

    <p v-else class="limits__card-sub-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'bet.hint') }}
    </p>

    <div class="limits__card-actions">
      <button-base
        type="primary"
        :is-disabled="isAllCurrenciesUsed || state.isShowEdit"
        @click="openModal('add-cash-limit', { props: { definition: 1 } })"
      >
        {{ getContent(limitsContent, defaultLimitsContent, 'addButtonLabel') }}
      </button-base>

      <button-base
        v-if="!state.isShowEdit && !isEditLocked"
        type="secondary"
        :is-disabled="isEditLocked"
        @click="state.isShowEdit = true"
      >
        {{ getContent(limitsContent, defaultLimitsContent, 'editButtonLabel') }}
      </button-base>

      <button-base v-if="state.isShowEdit" type="secondary" @click="state.isShowEdit = false">
        {{ getContent(limitsContent, defaultLimitsContent, 'doneButtonLabel') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const limitsStore = useLimitsStore();
  const { checkCurrencies } = limitsStore;
  const { betPeriods, limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currencies } = storeToRefs(globalStore);
  const { openModal } = useModalStore();

  const state = reactive<{ isShowEdit: boolean }>({
    isShowEdit: false,
  });

  const isEditLocked = computed(() => {
    return betPeriods.value.every(period => {
      const filteredPeriods = period.items.filter(item => item.status === 1);
      return filteredPeriods.every(item => item.cancelProcess && !item.pendingExist);
    });
  });

  const isAllCurrenciesUsed = computed(() => checkCurrencies(betPeriods.value, currencies.value));

  const isFullWidth = computed(() => betPeriods.value?.length > 1);
</script>
