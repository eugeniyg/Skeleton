<template>
  <div
    class="limits-periods-list__item"
  >
    <h4 class="limits-periods-list__item-title">{{ amount - currentAmount }} of {{ amount }} {{ currency }} left</h4>

    <p class="limits-periods-list__item-sub-title">subTitle</p>

    <button-base
      v-if="props.isShowEdit && (status === 1)"
      class="limits-periods-list__item-edit"
      type="ghost"
      @click="emit('edit', { id, amount })"
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
      <span class="limits-periods-list__item-status-title">{{ limitsStatuses[status] }} till {{ dayjs(createdAt).utc().format(DATE_FORMAT) }}</span>
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
    createdAt: string,
    currency: string,
    currentAmount: number,
    startedAt: string,
    expiredAt: string,
    cancelProcess: boolean,
    amount: number,
    title: string,
    isShowEdit: boolean,
  }

  const props = defineProps<PropsInterface>();

  const emit = defineEmits(['edit']);

  const state = reactive({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  dayjs.extend(utc);
  dayjs.extend(duration);
  dayjs.extend(timezone);

  const limitsStatuses: Record<number, string> = {
    1: 'Active',
    2: 'Pending',
    3: 'Canceled',
    4: 'Finished',
  };

  const getPercentage = (currentAmount: number, amount: number) => (currentAmount >= amount ? 100 : (((amount - currentAmount) / amount) * 100));

  const countdown = (startDate: string, endDate: string, onCountdownEnd: any) => {
    const targetDate = dayjs(endDate);

    const intervalId = setInterval(() => {
      const remainingTimeSeconds = targetDate.diff(dayjs(), 'second');

      if (remainingTimeSeconds <= 0) {
        clearInterval(intervalId);
        onCountdownEnd();
      } else {
        const remainingTime = dayjs.duration(remainingTimeSeconds, 'second');
        // const remainingDays = Math.floor(remainingTime.asDays());
        state.hours = remainingTime.hours();
        state.minutes = remainingTime.minutes();
        state.seconds = remainingTime.seconds();
      }
    }, 1000);
  };

  const onCountdownEnd = () => {
    console.log('Countdown has ended!');
  // Do something else here, such as displaying a message or triggering another function
  };

  // countdown('2023-04-24T10:25:11+03:00', '2023-04-25T12:25:11+03:00', onCountdownEnd);

  // onMounted(() => {
  //   console.log(dayjs().format());
  // });
</script>
