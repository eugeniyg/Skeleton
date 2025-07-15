<template>
  <div class="limits__card" :class="{ 'is-full-width': isFullWidth }">
    <h4 class="limits__card-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'coolingOff.label') }}
    </h4>

    <atomic-limits-list v-if="coolingOffLimits.length && !state.isEditProcess" :limits="sortedLimits" @edit="edit" />

    <div v-else class="limits__card-dropdown">
      <form-input-dropdown
        v-model:value="state.selectedPeriod"
        name="coolingOffDropdown"
        :placeholder="getContent(limitsContent, defaultLimitsContent, 'coolingOff.selectLabel')"
        :options="periodsOptions"
      />
      <button-base type="primary" :is-disabled="!state.selectedPeriod" @click="save">
        {{ getContent(limitsContent, defaultLimitsContent, 'setButtonLabel') }}
      </button-base>
    </div>

    <div class="limits__card-info">
      <p
        v-html="DOMPurify.sanitize(marked.parseInline(limitHintContent || '') as string, { FORBID_TAGS: ['style'] })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerLimit } from '@skeleton/api/types';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  import { updatePlayerLimit } from '@skeleton/api/profile';

  const dayjs = useDayjs();
  const limitsStore = useLimitsStore();
  const { createLimit, getLimits } = limitsStore;
  const { betPeriods, lossPeriods, isAdvancedModeEnabled } = storeToRefs(limitsStore);
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { limitsContent, defaultLimitsContent, coolingOffPeriod, coolingOffLimits } = storeToRefs(limitsStore);
  const limitHintContent = computed(() =>
    getContent(limitsContent.value, defaultLimitsContent.value, 'coolingOff.hint')
  );

  const state = reactive<{
    limitData?: IPlayerLimit;
    limitId: string | undefined;
    isEditProcess: boolean;
    selectedPeriod: string;
    definition: number;
    prevPeriod: string | undefined;
  }>({
    limitData: undefined,
    limitId: undefined,
    isEditProcess: false,
    selectedPeriod: '',
    prevPeriod: undefined,
    definition: 5,
  });

  const sortedLimits = computed(() => {
    return [...coolingOffLimits.value].sort((a, b) => a.status - b.status);
  });

  const isFullWidth = computed(
    () =>
      (!isAdvancedModeEnabled.value && betPeriods.value?.length > 1) ||
      (!isAdvancedModeEnabled.value && lossPeriods.value?.length < 2)
  );

  const edit = (limit: IPlayerLimit) => {
    state.isEditProcess = true;
    state.limitData = limit;
    state.limitId = limit.id;
    state.selectedPeriod = periodLessDay.value && !limit.pendingExist ? '' : (limit.period as string);
    state.prevPeriod = limit.period as string;
  };

  const save = async () => {
    if (!state.isEditProcess) {
      await createLimit({
        period: state.selectedPeriod,
        definition: state.definition,
      });
      await getLimits();
      showAlert(alertsData.value?.limit?.cashLimitAdd || defaultLocaleAlertsData.value?.limit?.cashLimitAdd);
    } else {
      await updatePlayerLimit({
        limitId: state.limitId as string,
        period: state.selectedPeriod,
      });
      await getLimits();
      state.isEditProcess = false;
    }
  };

  const periodLessDay = computed(() => {
    const diffDays = dayjs(state.limitData?.expiredAt).diff(dayjs(), 'day');
    return diffDays < 1;
  });

  const periodsOptions = computed(() => {
    if (!state.isEditProcess || state.limitData?.pendingExist || !periodLessDay.value) return coolingOffPeriod.value;

    const toPeriodIndex = coolingOffPeriod.value.findIndex(period => period.code === state.limitData?.period);
    return coolingOffPeriod.value.map((period, index) => ({ ...period, disabled: index <= toPeriodIndex }));
  });
</script>
