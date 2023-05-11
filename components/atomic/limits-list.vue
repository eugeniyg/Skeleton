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

    showAlert({
      title: getContent(alertsData.value, defaultLocaleAlertsData.value, 'coolingOfLimitCancel.title'),
      description: getContent(alertsData.value, defaultLocaleAlertsData.value, 'coolingOfLimitCancel.description'),
      type: getContent(alertsData.value, defaultLocaleAlertsData.value, 'coolingOfLimitCancel.type'),
    });
  };
</script>

<style lang="scss">
.limits-list {
  display: grid;
  grid-row-gap: 16px;

  &__item {
    display: grid;
  }

  &__input {
    display: flex;
    align-items: center;
    grid-column-gap: 8px;
    min-height: 21px;
  }

  &__value {
    @include font($heading-3);
    color: var(--white);
    flex-grow: 1;
  }

  &__status {
    display: flex;
    align-items: center;
    grid-column-gap: 2px;
    margin-top: 4px;

    &--pending {
      --dot-bg: var(--yellow-500);
    }

    &--active {
      --dot-bg: var(--green-500);
    }

    &-dot {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:before {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--dot-bg, var(--yellow-500));
      }
    }

    &-msg {
      @include font($body-0);
      color: var(--white);
    }
  }

  &__actions {
    display: flex;
    grid-column-gap: 4px;

    .btn-primary {
      width: 32px;
      height: 32px;
      --padding: 0;
      --bg: var(--gradient-radial);

      &:hover {
        --bg: var(--gradient-radial-hover);
      }

      &:active {
        --bg: var(--gradient-radial-focus);
      }

      &[disabled] {
        --bg: var(--yellow-900);
        --color: var(--black-primary);
      }
    }

    .btn-ghost {
      width: 32px;
      height: 32px;
      --padding: 0;
      --color: var(--gray-400);

      &:hover {
        --color: var(--yellow-500);
      }

      &:active {
        --bg: var(--gray-700);
      }

      &[disabled] {
        --color: var(--gray-600);
      }
    }
  }
}
</style>
