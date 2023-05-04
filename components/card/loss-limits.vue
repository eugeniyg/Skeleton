<template>
  <client-only>
    <div
      class="limits__card"
      :class="{ 'is-full-width': lossPeriods.length > 1 }"
    >
      <h4 class="limits__card-title" data-tooltip-parent>
        {{ limitsContent?.loss?.label || defaultLimitsContent?.loss?.label }}
        <atomic-tooltip
          v-if="lossPeriods.length"
          :text="limitsContent?.titleTooltip || defaultLimitsContent?.titleTooltip"
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
        {{ limitsContent?.loss?.hint || defaultLimitsContent?.loss?.hint }}
      </p>

      <div class="limits__card-actions">

        <button-base
          type="primary"
          @click="emit('open-limit-modal', definition)"
        >
          {{ limitsContent?.addButtonLabel || defaultLimitsContent?.addButtonLabel }}
        </button-base>

        <button-base
          v-if="!state.isShowEdit && !isEditLocked"
          type="secondary"
          @click="state.isShowEdit = true"
          :is-disabled="isEditLocked"
        >
          {{ limitsContent?.editButtonLabel || defaultLimitsContent?.editButtonLabel }}
        </button-base>

        <button-base
          v-if="state.isShowEdit"
          type="secondary"
          @click="state.isShowEdit = false"
        >
          {{ limitsContent?.doneButtonLabel || defaultLimitsContent?.doneButtonLabel }}
        </button-base>
      </div>

    </div>
  </client-only>
</template>

<script setup lang="ts">
  import { UpdateLimitInterface } from '@platform/frontend-core/dist/module';

  import { storeToRefs } from 'pinia';

  const emit = defineEmits([
    'open-limit-modal',
    'open-edit-modal',
    'update-limits',
  ]);

  const limitsStore = useLimitsStore();
  const { lossPeriods, limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);

  const state = reactive<{isShowEdit: boolean}>({
    isShowEdit: false,
  });

  const definition = 2;

  const openEditModal = ({ limitId, amount, currency }: UpdateLimitInterface) => {
    emit('open-edit-modal', { limitId, amount, currency });
  };

  const isEditLocked = computed(() => lossPeriods.value.every((period) => period.items.filter((item) => item.status === 1).every((item) => item.cancelProcess)));
</script>
