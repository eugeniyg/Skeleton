<template>
  <div class="limits-list">
    <div
      class="limits-list__item"
      v-for="limit in props.limits"
      :key="limit.id"
    >
      <div class="limits-list__input">
        <span class="limits-list__value">{{ formatPeriod(limit.period) }}</span>
        <div class="limits-list__actions" v-if="limit.status === 1">
          <button-base
            type="primary"
            @click="emit('edit', { limitId: limit.id, period: limit.period })"
            :is-disabled="limit.status === 1 && limit.cancelProcess"
          >
            <atomic-icon id="edit"/>
          </button-base>
          <button-base
            type="ghost"
            @click="remove(limit.id)"
            :is-disabled="limit.status === 1 && limit.cancelProcess"
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
  import { PlayerLimitInterface } from '@platform/frontend-core/dist/module';
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    limits: PlayerLimitInterface[]
  }>();

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

    showAlert(alertsData.value?.coolingOfLimitCancel || defaultLocaleAlertsData.value?.coolingOfLimitCancel);
  };
</script>

<style src="~/assets/styles/components/atomic/limits-list.scss" lang="scss" />
