<template>
  <div
    class="limits-periods-list__item"
  >
    <h4 class="limits-periods-list__item-title">{{ getSum(amount, currentAmount, currency) }} of {{ formatBalance(currency, amount).amount  }} {{ formatBalance(currency, amount).currency }} left</h4>

    <p class="limits-periods-list__item-sub-title" v-if="isShowContDown">
      <template v-if="state.isAlmostDone">
        Almost done
      </template>
      <template v-else>
        <span class="time-span" v-if="state.days">{{ format(state.days) }}d</span>
        <span class="time-span">{{ format(state.hours) }}h</span>
        <span class="time-span">{{ format(state.minutes) }}m</span>
        <span class="time-span">{{ format(state.seconds) }}s</span>
        until activate
      </template>

    </p>

    <button-base
      v-if="props.isShowEdit && (status === 1) && !cancelProcess"
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
        :class="`limits-periods-list__item-status-type--${ limitsStatuses[status].toLowerCase()  }`"
        :data-status="limitsStatuses[status]"
      />
      <span class="limits-periods-list__item-status-title">{{ limitsStatuses[status] }} till {{ dayjs(expiredAt).format(DATE_FORMAT) }}</span>
    </div>

  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  import duration from 'dayjs/plugin/duration';
  import timezone from 'dayjs/plugin/timezone';

  interface PropsInterface {
    id: string,
    status: number,
    period: string|null,
    createdAt: string,
    currency: string,
    currentAmount: number,
    startedAt: string,
    expiredAt: string,
    cancelProcess: boolean,
    amount: number,
    title?: string,
    isShowEdit?: boolean,
  }

  const props = defineProps<PropsInterface>();

  const emit = defineEmits(['edit-limit']);

  interface StateInterface {
    isAlmostDone: boolean,
    diffInSeconds: number,
    days: string|number,
    hours: string|number,
    minutes: string|number,
    seconds: string|number,
  }

  const state = reactive<StateInterface>({
    isAlmostDone: false,
    diffInSeconds: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
  const limitsStore = useLimitsStore();
  const { formatBalance } = useProjectMethods();
  const { getLimits } = limitsStore;

  dayjs.extend(utc);
  dayjs.extend(duration);
  dayjs.extend(timezone);

  const limitsStatuses: Record<number, string> = {
    1: 'Active',
    2: 'Pending',
    3: 'Canceled',
    4: 'Finished',
  };

  const getPercentage = (currentAmount: number, amount: number) => ((amount === 0) ? 100 : ((currentAmount / amount) * 100));

  const format = (value: number): number|string => (value < 10 ? `0${value}` : value);

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

  const isShowContDown = (() => props.period === 'weekly' || props.period === 'monthly');

  const getSum = (amount: number, currentAmount: number, currency: string) => {
    const balance = formatBalance(currency, amount);
    return balance.amount < currentAmount ? 0 : balance.amount - currentAmount;
  };

  onMounted(() => {
    if (props.expiredAt) {
      const start = Date.now();
      const end = new Date(props.expiredAt).getTime();

      state.diffInSeconds = Math.ceil((end - start) / 1000);

      countdown();
    }
  });
</script>

<style lang="scss">
.time-span {
  min-width: 22px;
  display: inline-flex;

  &:not(:first-of-type) {
    margin-left: 4px;
  }
}
</style>
