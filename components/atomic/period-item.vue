<template>
  <div class="limits-periods-list__item">
    <h4 class="limits-periods-list__item-title">{{ status === 1 ? statusActiveTitle : statusPendingTitle }}</h4>

    <p v-if="isShowContDown" class="limits-periods-list__item-sub-title">
      <template v-if="isAlmostDone">
        {{ getContent(limitsContent, defaultLimitsContent, 'timerAlmostDone') }}
      </template>

      <template v-else>
        <span v-if="days" class="time-span">{{ format(days) }}d</span>
        <span class="time-span">{{ format(hours) }}h</span>
        <span class="time-span">{{ format(minutes) }}m</span>
        <span class="time-span">{{ format(seconds) }}s</span>
        {{ timerLabel }}
      </template>
    </p>

    <button-base
      v-if="props.isShowEdit && status === 1 && (!props.cancelProcess || props.pendingExist)"
      class="limits-periods-list__item-edit"
      type="ghost"
      @click="emit('edit-limit')"
    >
      <atomic-icon id="edit" />
    </button-base>

    <div
      class="limits-periods-list__item-progress"
      :style="`--progress-width:${getPercentage(currentAmount, amount)}%`"
      :class="{ 'is-full': currentAmount >= amount }"
    />

    <div class="limits-periods-list__item-status">
      <span
        class="limits-periods-list__item-status-type"
        :class="`limits-periods-list__item-status-type--${limitsStatuses[status]}`"
      />
      <span class="limits-periods-list__item-status-title">
        {{ formatStatus }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    id: string;
    status: number;
    period: string | null;
    createdAt: string;
    currency: string;
    currentAmount: number;
    startedAt: string;
    expiredAt: string;
    cancelProcess: boolean;
    pendingExist: boolean;
    amount: number;
    title?: string;
    isShowEdit?: boolean;
  }>();

  const emit = defineEmits(['edit-limit']);

  const { isAlmostDone, days, hours, minutes, seconds, startTimer } = useTimer();

  const dayjs = useDayjs();
  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  const limitsStore = useLimitsStore();
  const { formatBalance, getContent } = useProjectMethods();
  const { getLimits } = limitsStore;
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
  const formatStatus = computed(() => {
    const msg =
      props.status === 1
        ? getContent(limitsContent.value, defaultLimitsContent.value, 'activeStatusLabel')
        : getContent(limitsContent.value, defaultLimitsContent.value, 'pendingStatusLabel');

    const dateValue = dayjs(props.expiredAt).format(DATE_FORMAT);

    return msg ? msg.replace('{date}', dateValue) : '';
  });

  const limitsStatuses: Record<number, string> = {
    1: 'active',
    2: 'pending',
  };

  const getPercentage = (currentAmount: number, amount: number) =>
    amount === 0 ? 100 : (currentAmount / amount) * 100;

  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);

  const statusActiveTitle = computed(() => {
    const message = getContent(limitsContent.value, defaultLimitsContent.value, 'availableLimitSum');
    if (!message) return '';

    const { amount, currency } = formatBalance(props.currency, props.amount);
    const balance = amount < props.currentAmount ? 0 : amount - props.currentAmount;

    const correction: Record<string, any> = {
      '{amount}': amount,
      '{balance}': balance,
      '{currency}': currency,
    };

    return Object.keys(correction).reduce((acc, key) => acc.replace(key, correction[key]), message);
  });

  const statusPendingTitle = computed(() => {
    const { amount, currency } = formatBalance(props.currency, props.amount);
    return `${amount} ${currency}`;
  });

  const timerLabel = computed(() =>
    props.status === 1
      ? getContent(limitsContent.value, defaultLimitsContent.value, 'statusActiveTimerLabel')
      : getContent(limitsContent.value, defaultLimitsContent.value, 'statusPendingTimerLabel')
  );

  const getLimitsTimer = ref<NodeJS.Timeout | null>(null);
  watch(isAlmostDone, newValue => {
    if (newValue) getLimitsTimer.value = setTimeout(getLimits, 60000);
  });

  const isShowContDown = computed(() => props.period === 'weekly' || props.period === 'monthly');

  onMounted(() => {
    if (props.expiredAt) {
      startTimer(props.expiredAt);
    }
  });

  onBeforeUnmount(() => {
    if (getLimitsTimer.value) clearTimeout(getLimitsTimer.value);
  });
</script>

<style src="~/assets/styles/components/atomic/period-item.scss" lang="scss" />
