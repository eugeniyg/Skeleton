<template>
  <div class="tournament-timer">
    <div v-if="isActive" class="tournament-timer__container">
      <div class="tournament-timer__label" :class="{ 'wait-start': props.tournamentData.state === 2 }">
        <template v-if="props.tournamentData.state === 2">
          {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.startTimerLabel') }}
        </template>

        <template v-else-if="props.tournamentData.state === 3">
          {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.finishTimerLabel') }}
        </template>
      </div>

      <div class="tournament-timer__countdown">
        <span class="time-span time-span-days">{{ format(days) }}</span>
        <span class="time-span-dots">:</span>
        <span class="time-span">{{ format(hours) }}</span>
        <span class="time-span-dots">:</span>
        <span class="time-span">{{ format(minutes) }}</span>
        <span class="time-span-dots">:</span>
        <span class="time-span">{{ format(seconds) }}</span>
      </div>
    </div>

    <div v-else-if="isFinished" class="tournament-timer__finished">
      {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.finishedLabel') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournament } from '@skeleton/core/types/tournamentsTypes';
  import type { ITournamentCommon } from '~/types';

  const props = defineProps<{
    tournamentData: ITournament;
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
  }>();
  const emit = defineEmits(['tournamentStarted', 'tournamentFinished']);

  const isActive = [2, 3].includes(props.tournamentData.state);
  const isFinished = [4, 5].includes(props.tournamentData.state);
  const { getContent } = useProjectMethods();
  const { isAlmostDone, days, hours, minutes, seconds, startTimer } = useTimer();

  watch(isAlmostDone, () => {
    if (props.tournamentData.state === 2) emit('tournamentStarted');
    else if (props.tournamentData.state === 3) emit('tournamentFinished');
  });

  const format = (value: string | number): number | string => (Number(value) < 10 ? `0${value}` : value);

  onMounted(() => {
    if (props.tournamentData.state === 2) startTimer(props.tournamentData.startAt);
    else if (props.tournamentData.state === 3) startTimer(props.tournamentData.endAt);
  });
</script>

<style src="~/assets/styles/components/tournament/timer.scss" lang="scss" />
