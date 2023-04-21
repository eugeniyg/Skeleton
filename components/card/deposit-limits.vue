<template>
  <div
    class="limits__card"
    :class="makeFullWidth(deposit.depositPeriods)"
  >
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ deposit.title }}
      <atomic-tooltip v-if="state.isShowPeriods" v-bind="deposit.tooltip"/>
    </h4>

    <atomic-limits-periods-list
      v-if="state.isShowPeriods"
      :limits="props.limits"
      :is-show-edit="state.isShowEdit"
    />

    <p v-else class="limits__card-sub-title">This setting limits the amount you can deposit per day, week or month'</p>

    <div class="limits__card-actions">
      <button-base
        type="primary"
        @click="emit('open-limit-modal', 3)"
      >
        Add new
      </button-base>

      <button-base
        v-if="state.isShowPeriods && !state.isShowEdit"
        type="secondary"
        @click="state.isShowEdit = true"
      >
        Edit limits
      </button-base>

      <button-base
        v-if="state.isShowPeriods && state.isShowEdit"
        type="secondary"
        @click="state.isShowEdit = false"
      >
        Done editing
      </button-base>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { PlayerLimitInterface } from '@platform/frontend-core/dist/module';

  const {
    profileLimits: {
      deposit,
    },
  } = useFakeStore();

  interface PropsInterface {
    limits: PlayerLimitInterface[],
  }

  const props = defineProps<PropsInterface>();
  const emit = defineEmits(['open-limit-modal']);

  interface StateInterface {
    isShowPeriods: boolean,
    isShowEdit: boolean
  }

  const state = reactive<StateInterface>({
    isShowPeriods: true,
    isShowEdit: false,
  });

  const makeFullWidth = (columns: any) => ({ 'is-full-width': Object.keys(columns).length > 1 });

  onMounted(() => {
    console.log(props.limits)
  })
</script>
