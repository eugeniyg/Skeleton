<template>
  <div class="limits__card limits__card--cooling-off">
    <h4 class="limits__card-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'coolingOff.label') }}
    </h4>

    <atomic-limits-list
      v-if="coolingOffLimits.length && !state.isEditProcess"
      :limits="sortedLimits"
      @edit="edit"
    />

    <div class="limits__card-dropdown" v-else>
      <form-input-dropdown
        name="coolingOffDropdown"
        v-model:value="state.selectedPeriod"
        :placeholder="getContent(limitsContent, defaultLimitsContent, 'coolingOff.selectLabel')"
        :options="coolingOffPeriod"
      />
      <button-base type="primary" :is-disabled="!state.selectedPeriod" @click="save">
        {{ getContent(limitsContent, defaultLimitsContent, 'setButtonLabel') }}
      </button-base>
    </div>

    <div class="limits__card-info">
      <p>{{ getContent(limitsContent, defaultLimitsContent, 'coolingOff.hint') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const limitsStore = useLimitsStore();
  const { createLimit, getLimits } = limitsStore;
  const { updatePlayerLimit } = useCoreProfileApi();
  const { getContent } = useProjectMethods();
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const {
    limitsContent, defaultLimitsContent, coolingOffPeriod, coolingOffLimits,
  } = storeToRefs(limitsStore);

  const state = reactive<{
    limitId: string | undefined,
    isEditProcess: boolean,
    selectedPeriod: string,
    definition: number,
    prevPeriod: string|undefined,
  }>({
    limitId: undefined,
    isEditProcess: false,
    selectedPeriod: '',
    prevPeriod: undefined,
    definition: 5,
  });

  const sortedLimits = computed(() => coolingOffLimits.value.sort((a, b) => a.status - b.status));

  const edit = ({ limitId, period }: {limitId: string, period: string}) => {
    state.isEditProcess = true;
    state.limitId = limitId;
    state.selectedPeriod = period;
    state.prevPeriod = period;
  };

  const save = async () => {
    if (!state.isEditProcess) {
      await createLimit({
        period: state.selectedPeriod,
        definition: state.definition,
      });
      await getLimits();
      showAlert(alertsData.value?.cashLimitAdd || defaultLocaleAlertsData.value?.cashLimitAdd);
    } else {
      await updatePlayerLimit({
        limitId: state.limitId,
        period: state.selectedPeriod,
      });
      await getLimits();
      state.isEditProcess = false;
    }
  };
</script>
