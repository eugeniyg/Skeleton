<template>
  <div class="limits__card" :class="{ 'is-full-width': isFullWidth }">
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ getContent(limitsContent, defaultLimitsContent, 'deposit.label') }}
      <atomic-tooltip
        v-if="depositPeriods.length"
        :text="getContent(limitsContent, defaultLimitsContent, 'deposit.hint')"
        align="bottom"
      />
    </h4>

    <atomic-limits-periods-list
      v-if="depositPeriods.length"
      :periods="depositPeriods"
      :is-show-edit="state.isShowEdit"
      @open-edit-modal="openEditModal"
    />

    <p v-else class="limits__card-sub-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'deposit.hint') }}
    </p>

    <div class="limits__card-actions">
      <button-base
        type="primary"
        :is-disabled="isAllCurrenciesUsed || state.isShowEdit"
        @click="emit('open-limit-modal', definition)"
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
  import type { IUpdateLimit } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';

  const emit = defineEmits(['open-limit-modal', 'open-edit-modal']);

  const limitsStore = useLimitsStore();
  const { getContent } = useProjectMethods();
  const { checkCurrencies } = limitsStore;
  const { depositPeriods, limitsContent, defaultLimitsContent, isAdvancedModeEnabled, lossPeriods } =
    storeToRefs(limitsStore);
  const globalStore = useGlobalStore();
  const { currencies } = storeToRefs(globalStore);

  const state = reactive<{ isShowEdit: boolean }>({
    isShowEdit: false,
  });

  const definition = 3;

  const openEditModal = (payload: IUpdateLimit) => {
    emit('open-edit-modal', payload);
  };

  const isEditLocked = computed(() =>
    depositPeriods.value.every(period => {
      const filteredPeriods = period.items.filter(item => item.status === 1);
      return filteredPeriods.every(item => item.cancelProcess && !item.pendingExist);
    })
  );

  const isAllCurrenciesUsed = computed(() => checkCurrencies(depositPeriods.value, currencies.value));

  const isFullWidth = computed(
    () =>
      (isAdvancedModeEnabled.value && lossPeriods.value?.length > 1) ||
      (isAdvancedModeEnabled.value && depositPeriods.value.length > 1)
  );
</script>
