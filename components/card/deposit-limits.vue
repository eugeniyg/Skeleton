<template>
  <client-only>
    <div
      class="limits__card"
      :class="{ 'is-full-width': depositPeriods.length > 1 }"
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
        {{ getContent(limitsContent, defaultLimitsContent, 'deposit?.hint') }}
      </p>

      <div class="limits__card-actions">
        <button-base
          type="primary"
          @click="emit('open-limit-modal', definition)"
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
  </client-only>
</template>

<script setup lang="ts">
  import { UpdateLimitInterface } from '@platform/frontend-core/dist/module';

  import { storeToRefs } from 'pinia';

  const emit = defineEmits([
    'open-limit-modal',
    'open-edit-modal',
  ]);

  const limitsStore = useLimitsStore();
  const { getContent } = useProjectMethods();
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
