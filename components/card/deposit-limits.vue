<template>
  <div
    class="limits__card"
    :class="{'is-full-width': isFullWidth}"
  >
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ getContent(limitsContent, defaultLimitsContent, 'deposit.label') }}
      <atomic-tooltip
        v-if="depositPeriods.length"
        :text="getContent(limitsContent, defaultLimitsContent, 'titleTooltip')"
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
  import { UpdateLimitInterface } from '@platform/frontend-core/dist/module';

  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '~/composables/useGlobalStore';

  const emit = defineEmits([
    'open-limit-modal',
    'open-edit-modal',
  ]);

  const limitsStore = useLimitsStore();
  const { getContent } = useProjectMethods();
  const { setColumns, checkCurrencies } = limitsStore;
  const {
    depositPeriods, limitsContent, defaultLimitsContent, isAdvancedModeEnabled, lossPeriods,
  } = storeToRefs(limitsStore);
  const globalStore = useGlobalStore();
  const { currencies } = storeToRefs(globalStore);

  const state = reactive<{ isShowEdit: boolean }>({
    isShowEdit: false,
  });

  const definition = 3;

  const openEditModal = (payload: UpdateLimitInterface) => {
    emit('open-edit-modal', payload);
  };

  const isEditLocked = computed(() => depositPeriods.value.every((period) => period.items.filter((item) => item.status === 1).every((item) => item.cancelProcess)));

  const isAllCurrenciesUsed = computed(() => checkCurrencies(depositPeriods.value, currencies.value));

  const isFullWidth = computed(() => (isAdvancedModeEnabled.value && lossPeriods.value?.length > 1) || (isAdvancedModeEnabled.value && depositPeriods.value.length > 1));

  watch(() => depositPeriods.value, (newValue) => {
    setColumns('deposit', newValue.length);
  });

  onMounted(() => {
    setColumns('deposit', depositPeriods.value.length === 0 ? 1 : depositPeriods.value.length);
  });

  onUnmounted(() => {
    setColumns('deposit', 0);
  });
</script>
