<template>
  <div
    class="limits__card limits__card--bet"
  >
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ getContent(limitsContent, defaultLimitsContent, 'bet.label') }}
      <atomic-tooltip
        v-if="betPeriods.length"
        :text="getContent(limitsContent, defaultLimitsContent, 'titleTooltip')"
        align="bottom"
      />
    </h4>

    <atomic-limits-periods-list
      v-if="betPeriods.length"
      :periods="betPeriods"
      :is-show-edit="state.isShowEdit"
      @open-edit-modal="openEditModal"
    />

    <p v-else class="limits__card-sub-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'bet.hint') }}
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
  const { setColumns } = limitsStore;
  const { betPeriods, limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
  const { getContent } = useProjectMethods();

  const state = reactive<{ isShowEdit: boolean }>({
    isShowEdit: false,
  });

  const definition = 1;

  const openEditModal = (payload: UpdateLimitInterface) => {
    emit('open-edit-modal', payload);
  };

  const isEditLocked = computed(() => betPeriods.value.every((period) => period.items.filter((item) => item.status === 1).every((item) => item.cancelProcess)));

  watch(() => betPeriods.value, (newValue) => {
    setColumns('bet', newValue.length);
  });

  onMounted(() => {
    setColumns('bet', betPeriods.value.length);
  });
</script>
