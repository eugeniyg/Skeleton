<template>
  <client-only>
    <div
      class="limits__card"
      :class="{ 'is-full-width': depositPeriods.length > 1 }"
    >
      <h4 class="limits__card-title" data-tooltip-parent>
        {{ limitsContent?.deposit?.label || defaultLimitsContent?.deposit?.label }}
        <atomic-tooltip
          v-if="depositPeriods.length"
          :text="limitsContent?.titleTooltip || defaultLimitsContent?.titleTooltip"
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
        {{ limitsContent?.deposit?.hint || defaultLimitsContent?.deposit?.hint }}
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
  const { depositPeriods, limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);

  const state = reactive<{isShowEdit: boolean}>({
    isShowEdit: false,
  });

  const definition = 3;

  const openEditModal = ({ limitId, amount, currency }: UpdateLimitInterface) => {
    emit('open-edit-modal', { limitId, amount, currency });
  };

  const isEditLocked = computed(() => depositPeriods.value.every((period) => period.items.filter((item) => item.status === 1).every((item) => item.cancelProcess)));
</script>
