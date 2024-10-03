<template>
  <div
    class="limits-periods-list__item"
  >
    <h4 class="limits-periods-list__item-title">{{ status === 1 ? statusActiveTitle : statusPendingTitle }}</h4>

    <p v-if="isShowContDown" class="limits-periods-list__item-sub-title">
      <template v-if="state.isAlmostDone">
        {{ getContent(limitsContent, defaultLimitsContent, 'timerAlmostDone') }}
      </template>
      <template v-else>
        <span v-if="state.days" class="time-span">{{ format(state.days) }}d</span>
        <span class="time-span">{{ format(state.hours) }}h</span>
        <span class="time-span">{{ format(state.minutes) }}m</span>
        <span class="time-span">{{ format(state.seconds) }}s</span>
        {{ timerLabel }}
      </template>
    </p>

    <button-base
      v-if="props.isShowEdit && (status === 1) && (!props.cancelProcess || props.pendingExist)"
      class="limits-periods-list__item-edit"
      type="ghost"
      @click="emit('edit-limit')"
    >
      <atomic-icon id="edit"/>
    </button-base>

    <div
      class="limits-periods-list__item-progress"
      :style="`--progress-width:${ getPercentage(currentAmount, amount) }%`"
      :class="{'is-full': currentAmount >= amount }"
    />

    <div class="limits-periods-list__item-status">
      <span
        class="limits-periods-list__item-status-type"
        :class="`limits-periods-list__item-status-type--${ limitsStatuses[status] }`"
      />
      <span class="limits-periods-list__item-status-title">
        {{ formatStatus }}
      </span>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';

  const props = defineProps<{
    id: string,
    status: number,
    period: string|null,
    createdAt: string,
    currency: string,
    currentAmount: number,
    startedAt: string,
    expiredAt: string,
    cancelProcess: boolean,
    pendingExist: boolean,
    amount: number,
    title?: string,
    isShowEdit?: boolean,
  }>();

  const emit = defineEmits(['edit-limit']);

  const state = reactive<{
    isAlmostDone: boolean,
    diffInSeconds: number,
    days: string|number,
    hours: string|number,
    minutes: string|number,
    seconds: string|number,
  }>({
    isAlmostDone: false,
    diffInSeconds: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const dayjs = useDayjs();
  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  const limitsStore = useLimitsStore();
  const { formatBalance, getContent } = useProjectMethods();
  const { getLimits } = limitsStore;
  const { limitsContent, defaultLimitsContent } = storeToRefs(limitsStore);
  const formatStatus = computed(() => {
    const msg = props.status === 1
      ? getContent(limitsContent.value, defaultLimitsContent.value, 'activeStatusLabel')
      : getContent(limitsContent.value, defaultLimitsContent.value, 'pendingStatusLabel');

    const dateValue = dayjs(props.expiredAt).format(DATE_FORMAT);

    return msg ? msg.replace('{date}', dateValue) : '';
  });

  const limitsStatuses: Record<number, string> = {
    1: 'active',
    2: 'pending',
  };

  const getPercentage = (currentAmount: number, amount: number) => ((amount === 0) ? 100 : ((currentAmount / amount) * 100));

  const format = (value: string|number): number|string => (Number(value) < 10 ? `0${value}` : value);

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

  const timerLabel = computed(() => (props.status === 1
    ? getContent(limitsContent.value, defaultLimitsContent.value, 'statusActiveTimerLabel')
    : getContent(limitsContent.value, defaultLimitsContent.value, 'statusPendingTimerLabel')
  ));

  const countdown = () => {
    const tick = async () => {
      if (state.diffInSeconds <= 0) {
        state.isAlmostDone = true;

        setTimeout(getLimits, 60000);
      } else {
        state.diffInSeconds -= 1;
        state.days = Math.floor(state.diffInSeconds / (24 * 3600));
        state.hours = Math.floor(state.diffInSeconds / 3600) % 24;
        state.minutes = Math.floor((state.diffInSeconds % 3600) / 60);
        state.seconds = state.diffInSeconds % 60;

        setTimeout(tick, 1000);
      }
    };

    tick();
  };

  const isShowContDown = computed(() => props.period === 'weekly' || props.period === 'monthly');

  onMounted(() => {
    if (props.expiredAt) {
      const start = Date.now();
      const end = new Date(props.expiredAt).getTime();

      state.diffInSeconds = Math.ceil((end - start) / 1000);

      countdown();
    }
  });
</script>

<style src="~/assets/styles/components/atomic/period-item.scss" lang="scss" />
