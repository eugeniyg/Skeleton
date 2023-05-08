<template>
  <div class="limits__card">
    <h4 class="limits__card-title">
      {{ getContent(limitsContent, defaultLimitsContent, 'coolingOff.label') }}
    </h4>

    <atomic-limits-list
      v-if="coolingOffLimits.length && !state.isEditProcess"
      :limits="coolingOffLimits"
      @edit="edit"
    />

    <div class="limits__card-dropdown" v-else>
      <form-input-dropdown
        name="coolingOffDropdown"
        v-model:value="state.selectedPeriod"
        placeholder="none"
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
    selectedPeriod: string | undefined,
    definition: number,
  }>({
    limitId: undefined,
    isEditProcess: false,
    selectedPeriod: undefined,
    definition: 5,
  });

  const edit = ({ limitId, period }: {limitId: string, period: string}) => {
    state.isEditProcess = true;
    state.limitId = limitId;
    state.selectedPeriod = period;
  };

  const save = async () => {
    if (!state.isEditProcess) {
      await createLimit({
        period: state.selectedPeriod,
        definition: state.definition,
      });
      await getLimits();
      showAlert({
        title: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitAdd.title'),
        type: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitAdd.type'),
      });
    } else {
      await updatePlayerLimit({
        limitId: state.limitId,
        period: state.selectedPeriod,
      });
      await getLimits();
      state.isEditProcess = false;

      // if (isLargeAmount.value) {
      //   showAlert({
      //     title: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditLargeAmount.title'),
      //     description: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditLargeAmount.description'),
      //     type: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditLargeAmount.type'),
      //   });
      // } else {
      //   showAlert({
      //     title: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditSmallerAmount.title'),
      //     type: getContent(alertsData.value, defaultLocaleAlertsData.value, 'cashLimitEditSmallerAmount.type'),
      //   });
      // }
    }
  };

</script>
