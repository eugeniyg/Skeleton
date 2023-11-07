<template>
  <div class="limits-list">
    <div
      class="limits-list__item"
      v-for="limit in props.limits"
      :key="limit.id"
    >
      <div class="limits-list__input">
        <span class="limits-list__value">
          {{ formatPeriod(limit.period) }}
        </span>

        <div class="limits-list__actions" v-if="limit.status === 1">
          <button-base
            type="primary"
            @click="emit('edit', limit)"
            :is-disabled="limit.status === 1 && limit.cancelProcess && !limit.pendingExist"
          >
            <atomic-icon id="edit"/>
          </button-base>

          <button-base
            type="ghost"
            @click="remove(limit.id)"
            :is-disabled="limit.status === 1 && (limit.cancelProcess || periodLessDay(limit)) && !limit.pendingExist"
          >
            <atomic-icon id="trash"/>
          </button-base>
        </div>
      </div>

      <div
        class="limits-list__status"
        :class="`limits-list__status--${limit.status === 1 ? 'active': 'pending'}`"
      >
        <span class="limits-list__status-dot"></span>
        <span class="limits-list__status-msg">
          <atomic-limit-countdown :status="limit.status" :expired-at="limit.expiredAt"/>
        </span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerLimit} from "@skeleton/core/types";
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    limits: IPlayerLimit[]
  }>();

  const dayjs = useDayjs();
  const limitsStore = useLimitsStore();
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
  const { getContent } = useProjectMethods();
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const emit = defineEmits(['edit']);

  const { deletePlayerLimit } = useCoreProfileApi();
  const { getLimits } = useLimitsStore();

  const formatPeriod = (periodKey: string) => {
    const content = getContent(limitsContent.value, defaultLimitsContent.value, 'periodOptions');
    return content[periodKey];
  };

  const remove = async (limitId: string) => {
    await deletePlayerLimit(limitId);
    await getLimits();

    showAlert(alertsData.value?.limit?.coolingOfLimitCancel || defaultLocaleAlertsData.value?.limit?.coolingOfLimitCancel);
  };

  const periodLessDay = (limitData: IPlayerLimit) => {
    const diffDays = dayjs(limitData.expiredAt).diff(dayjs(), 'day');
    return diffDays < 1;
  }
</script>

<style src="~/assets/styles/components/atomic/limits-list.scss" lang="scss" />
