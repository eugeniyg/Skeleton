<template>
  <div
    class="limits__card"
    :class="makeFullWidth(props.limits)"
  >
    <h4 class="limits__card-title" data-tooltip-parent>
      {{ betLimits.title }}
      <atomic-tooltip v-if="isShowPeriods" v-bind="betLimits.tooltip"/>
    </h4>

    <div class="limits__card-info is-text-center">
      <p>This setting limits the amount you can wager per day, week or month.</p>
    </div>

    <div class="limits__card-actions" @click="emit('open-limit-modal', 1)">
      <button-base type="primary">Add new 1</button-base>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PlayerLimitInterface } from '@platform/frontend-core/dist/module';

  const {
    profileLimits: {
      betLimits,
    },
  } = useFakeStore();

  interface PropsInterface {
    limits?: PlayerLimitInterface[],
  }

  const props = defineProps<PropsInterface>();
  const emit = defineEmits(['open-limit-modal']);
  const isShowPeriods = ref<boolean>(true);
  const isShowEdit = ref<boolean>(false);

  const makeFullWidth = (columns: any) => ({ 'is-full-width': Object.keys(columns).length > 1 });

</script>
