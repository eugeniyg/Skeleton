<template>
  <div
    class="limits__card"
    :class="{ 'is-full-width': Object.keys(props.periods).length > 1 }"
    data-x="1"
  >
    <pre style="color: white">{{ Object.keys(props.periods).length > 1 }}</pre>

    <h4 class="limits__card-title" data-tooltip-parent>
      {{ props.title }}
      <atomic-tooltip v-if="isShowPeriods" v-bind="tooltipProps"/>
    </h4>

    <!--    <pre style="color:white; font-size: 10px">{{ props.periods }}</pre>-->

    <atomic-limits-periods-list
      v-if="isShowPeriods"
      :periods="props.periods"
      :is-show-edit="state.isShowEdit"
      @open-edit-modal="openEditModal"
    />

    <p v-else class="limits__card-sub-title">This setting limits the amount you can deposit per day, week or month</p>

    <div class="limits__card-actions">

      <button-base
        type="primary"
        @click="emit('open-limit-modal', props.definition)"
      >
        Add new
      </button-base>

      <button-base
        v-if="!state.isShowEdit"
        type="secondary"
        @click="state.isShowEdit = true"
        :is-disabled="isEditLocked"
      >
        Edit limits
      </button-base>

      <button-base
        v-if="state.isShowEdit"
        type="secondary"
        @click="state.isShowEdit = false"
      >
        Done editing
      </button-base>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { PlayerLimitInterface, UpdateLimitInterface } from '@platform/frontend-core/dist/module';

  interface PropsInterface {
    title: string,
    definition: number,
    periods: {
      title: string,
      items: PlayerLimitInterface[]
    }[]
  }

  const props = defineProps<PropsInterface>();

  const emit = defineEmits([
    'open-limit-modal',
    'open-edit-modal',
  ]);

  interface StateInterface {
    isShowEdit: boolean
  }

  const state = reactive<StateInterface>({
    isShowEdit: false,
  });

  const tooltipProps = {
    text: 'This setting limits the amount you can deposit per day, week or month.',
    align: 'bottom',
  };

  const isShowPeriods = computed(() => props.periods.length);

  // const makeFullWidth = computed(() => ({ 'is-full-width': Object.keys(props.periods).length > 1 }));

  const openEditModal = ({ limitId, amount, currency }: UpdateLimitInterface) => {
    emit('open-edit-modal', { limitId, amount, currency });
  };

  // const isEditLocked = computed(() => props.limits.every((limit) => limit.cancelProcess));
  const isEditLocked = false;

  onMounted(() => {
    console.log(props.periods);
  });

</script>
