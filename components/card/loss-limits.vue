<template>
  <div class="limits__card" :class="{ 'is-full-width': isFullWidth }">
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ getContent(limitsContent, defaultLimitsContent, 'loss.label') }}
      <atomic-tooltip
        v-if="lossPeriods.length"
        :text="getContent(limitsContent, defaultLimitsContent, 'loss.hint')"
        align="bottom"
      />
    </h4>

    <atomic-limits-periods-list v-if="lossPeriods.length" :periods="lossPeriods" :is-show-edit="state.isShowEdit" />

    <p v-else class="limits__card-sub-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'loss.hint') }}
    </p>

    <div class="limits__card-actions">
      <button-base
        type="primary"
        :is-disabled="isAllCurrenciesUsed || state.isShowEdit"
        @click="openModal('add-cash-limit', { props: { definition: 2 } })"
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
  const limitsStore = useLimitsStore();
  const { checkCurrencies } = limitsStore;
  const { lossPeriods, betPeriods, depositPeriods, limitsContent, defaultLimitsContent, isAdvancedModeEnabled } =
    storeToRefs(limitsStore);

  const globalStore = useGlobalStore();
  const { currencies } = storeToRefs(globalStore);
  const { openModal } = useModalStore();

  const state = reactive<{ isShowEdit: boolean }>({
    isShowEdit: false,
  });

  const isEditLocked = computed(() => {
    return lossPeriods.value.every(period => {
      const filteredPeriods = period.items.filter(item => item.status === 1);
      return filteredPeriods.every(item => item.cancelProcess && !item.pendingExist);
    });
  });

  const isAllCurrenciesUsed = computed(() => checkCurrencies(lossPeriods.value, currencies.value));

  const isFullWidth = computed(
    () =>
      lossPeriods.value?.length > 1 ||
      (!isAdvancedModeEnabled.value && betPeriods.value?.length > 1) ||
      (isAdvancedModeEnabled.value && depositPeriods.value?.length > 1 && betPeriods.value?.length > 1)
  );
</script>
