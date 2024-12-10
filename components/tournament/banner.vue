<template>
  <div class="tournament-banner" :class="{ 'tournament-banner--finished': isFinished }">
    <div class="tournament-banner__container">
      <tournament-timer
        :key="`${props.tournamentData.startAt || 'start'}-${props.tournamentData.endAt || 'finish'}`"
        :tournamentData="props.tournamentData"
        :currentLocaleCommonContent="props.currentLocaleCommonContent"
        :defaultLocaleCommonContent="props.defaultLocaleCommonContent"
        @tournamentStarted="timerHandler"
        @tournamentFinished="timerHandler"
      />

      <div class="tournament-banner__content">
        <div v-if="isFinished" class="tournament-banner__finished-date">
          {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.finishedDateLabel') }}
          - {{ dayjs(props.tournamentData?.endAt || '').format('DD.MM.YYYY') }}
        </div>
        <div class="tournament-banner__title">{{ props.tournamentContent?.name }}</div>
        <div class="tournament-banner__sub-title">{{ props.tournamentContent?.reward }}</div>
      </div>

      <atomic-image
        v-if="props.tournamentContent?.image"
        class="tournament-banner__img"
        :src="props.tournamentContent.image"
      />

      <div v-if="isActive" class="tournament-banner__actions">
        <button-base v-if="isLoggedIn" type="primary" size="md" :url="`/tournaments/${props.tournamentData.identity}`">
          {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.buttonLabels.play') }}
        </button-base>

        <button-base v-else type="primary" size="md" @click="openModal('sign-up')">
          {{
            getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.buttonLabels.register')
          }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentGeneral } from '@skeleton/core/types/tournamentsTypes';
  import type { ITournamentCommon, ITournamentPage } from '~/types';

  const props = defineProps<{
    tournamentData: ITournamentGeneral;
    tournamentContent: Maybe<ITournamentPage>;
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
  }>();

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { getContent } = useProjectMethods();
  const { openModal } = useModalStore();
  const dayjs = useDayjs();

  const isActive = [2, 3].includes(props.tournamentData.state);
  const isFinished = [4, 5].includes(props.tournamentData.state);

  const timerHandler = () => {
    console.log('timerHandler');
  };
</script>

<style src="~/assets/styles/components/tournament/banner.scss" lang="scss" />
