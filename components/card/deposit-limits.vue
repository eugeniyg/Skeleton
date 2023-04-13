<template>
  <div
    class="limits__card"
    :class="makeFullWidth(deposit.depositPeriods)"
  >
    <pre>{{ props.limits }}</pre>

    <h4 class="limits__card-title" data-tooltip-parent>
      {{ deposit.title }}
      <atomic-tooltip v-if="isShowPeriods" v-bind="deposit.tooltip"/>
    </h4>

    <atomic-limits-periods-list
      v-if="isShowPeriods"
      :periods="deposit.depositPeriods"
      :is-show-edit="isShowEdit"
    />

    <p v-else class="limits__card-sub-title">{{ deposit.subTitle }}</p>

    <div class="limits__card-actions">
      <button-base
        type="primary"
        @click="emit('open-limit-modal', 3)"
      >
        Add new
      </button-base>

      <button-base
        v-if="isShowPeriods && !isShowEdit"
        type="secondary"
        @click="isShowEdit = true"
      >
        {{ deposit.buttons.edit.base }}
      </button-base>

      <button-base
        v-if="isShowPeriods && isShowEdit"
        type="secondary"
        @click="isShowEdit = false"
      >
        {{ deposit.buttons.edit.done }}
      </button-base>

    </div>
  </div>
</template>

<script setup lang="ts">
  import { LimitInterface } from '~/types/limits';

  const {
    profileLimits: {
      deposit,
    },
  } = useFakeStore();

  interface PropsInterface {
    limits?: LimitInterface[],
  }

  const props = defineProps<PropsInterface>();
  const emit = defineEmits(['open-limit-modal']);
  const isShowPeriods = ref<boolean>(true);
  const isShowEdit = ref<boolean>(false);

  const makeFullWidth = (columns: any) => ({ 'is-full-width': Object.keys(columns).length > 1 });
</script>
