<template>
  <div class="limits-list">
    <div v-for="limit in props.limits" :key="limit.id" class="limits-list__item">
      <div class="limits-list__input">
        <span class="limits-list__value">
          {{ formatPeriod(limit.period) }}
        </span>

        <div v-if="limit.status === 1" class="limits-list__actions">
          <button-base
            type="primary"
            :is-disabled="limit.status === 1 && limit.cancelProcess && !limit.pendingExist"
            @click="emit('edit', limit)"
          >
            <atomic-icon id="edit" />
          </button-base>

          <button-base
            type="ghost"
            :is-disabled="limit.status === 1 && (limit.cancelProcess || periodLessDay(limit)) && !limit.pendingExist"
            @click="remove(limit.id)"
          >
            <atomic-icon id="trash" />
          </button-base>
        </div>
      </div>

      <div class="limits-list__status" :class="`limits-list__status--${limit.status === 1 ? 'active' : 'pending'}`">
        <span class="limits-list__status-dot" />
        <span class="limits-list__status-msg">
          <atomic-limit-countdown :status="limit.status" :expired-at="limit.expiredAt" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPlayerLimit } from '@skeleton/api/types';
  import { deletePlayerLimit } from '@skeleton/api/profile';

  const props = defineProps<{
    limits: IPlayerLimit[];
  }>();

  const dayjs = useDayjs();
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);

  const emit = defineEmits(['edit']);

  const { getLimits } = useLimitsStore();

  const formatPeriod = (periodKey: string | null) => {
    if (!periodKey) return;
    const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();
    const content = getContent(globalComponentsContent, defaultLocaleGlobalComponentsContent, 'constants.limitPeriods');
    return content[periodKey];
  };

  const remove = async (limitId: string) => {
    await deletePlayerLimit(limitId);
    await getLimits();

    showAlert(
      alertsData.value?.limit?.coolingOfLimitCancel || defaultLocaleAlertsData.value?.limit?.coolingOfLimitCancel
    );
  };

  const periodLessDay = (limitData: IPlayerLimit) => {
    const diffDays = dayjs(limitData.expiredAt).diff(dayjs(), 'day');
    return diffDays < 1;
  };
</script>

<style src="~/assets/styles/components/atomic/limits-list.scss" lang="scss" />
