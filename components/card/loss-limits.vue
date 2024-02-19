<template>
  <div
    class="limits__card"
    :class="{'is-full-width': isFullWidth}"
  >
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ getContent(limitsContent, defaultLimitsContent, 'loss.label') }}
      <atomic-tooltip
        v-if="lossPeriods.length"
        :text="getContent(limitsContent, defaultLimitsContent, 'titleTooltip')"
        align="bottom"
      />
    </h4>

    <atomic-limits-periods-list
      v-if="lossPeriods.length"
      :periods="lossPeriods"
      :is-show-edit="state.isShowEdit"
      @open-edit-modal="openEditModal"
    />

    <p v-else class="limits__card-sub-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'loss.hint') }}
    </p>

    <div class="limits__card-actions">

      <button-base
        type="primary"
        @click="emit('open-limit-modal', definition)"
        :is-disabled="isAllCurrenciesUsed || state.isShowEdit"
      >
        {{ getContent(limitsContent, defaultLimitsContent, 'addButtonLabel') }}
      </button-base>

      <button-base
        v-if="!state.isShowEdit && !isEditLocked"
        type="secondary"
        @click="state.isShowEdit = true"
        :is-disabled="isEditLocked"
      >
        {{ getContent(limitsContent, defaultLimitsContent, 'editButtonLabel') }}
      </button-base>

      <button-base
        v-if="state.isShowEdit"
        type="secondary"
        @click="state.isShowEdit = false"
      >
        {{ getContent(limitsContent, defaultLimitsContent, 'doneButtonLabel') }}
      </button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IUpdateLimit } from '@skeleton/core/types';
  import { storeToRefs } from 'pinia';

  const emit = defineEmits([
    'open-limit-modal',
    'open-edit-modal',
    'update-limits',
  ]);

  const limitsStore = useLimitsStore();
  const { checkCurrencies } = limitsStore;
  const {
    lossPeriods,
    betPeriods,
    depositPeriods,
    limitsContent,
    defaultLimitsContent,
    isAdvancedModeEnabled
  } = storeToRefs(limitsStore);

  const { getContent } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { currencies } = storeToRefs(globalStore);

  const state = reactive<{ isShowEdit: boolean }>({
    isShowEdit: false,
  });

  const definition = 2;

  const openEditModal = (payload: IUpdateLimit) => {
    emit('open-edit-modal', payload);
  };

  const isEditLocked = computed(() => {
    return lossPeriods.value.every((period) => {
      const filteredPeriods = period.items.filter((item) => item.status === 1)
      return filteredPeriods.every((item) => item.cancelProcess && !item.pendingExist)
    })
  });

  const isAllCurrenciesUsed = computed(() => checkCurrencies(lossPeriods.value, currencies.value));

  const isFullWidth = computed(() => lossPeriods.value?.length > 1
    || (!isAdvancedModeEnabled.value && betPeriods.value?.length > 1)
    || (isAdvancedModeEnabled.value && depositPeriods.value?.length > 1 && betPeriods.value?.length > 1));
</script>
