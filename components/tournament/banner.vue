<template>
  <div class="tournament-banner" :class="{ 'tournament-banner--finished': isFinished }">
    <div class="tournament-banner__container">
      <tournament-timer
        :key="`${props.tournamentData.startAt || 'start'}-${props.tournamentData.endAt || 'finish'}`"
        :tournamentData="props.tournamentData"
        :currentLocaleCommonContent="props.currentLocaleCommonContent"
        :defaultLocaleCommonContent="props.defaultLocaleCommonContent"
        @tournamentStarted="emit('statusChanged')"
        @tournamentFinished="emit('statusChanged')"
      />

      <div class="tournament-banner__content">
        <div v-if="isFinished" class="tournament-banner__finished-date">
          {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.finishedDateLabel') }}
          - {{ dayjs(props.tournamentData.endAt || '').format('DD.MM.YYYY') }}
        </div>
        <div class="tournament-banner__title">{{ props.tournamentContent?.name }}</div>
        <div class="tournament-banner__sub-title">{{ props.tournamentContent?.reward }}</div>
      </div>

      <atomic-image
        v-if="props.tournamentContent?.image"
        class="tournament-banner__img"
        :src="props.tournamentContent.image"
      />

      <div
        v-if="props.tournamentData.state === 3 && props.tournamentData.isAvailable"
        class="tournament-banner__actions"
      >
        <client-only>
          <transition name="fade" mode="out-in">
            <button-base v-if="actionState && props.gamesCount" type="primary" size="md" @click="handleAction">
              {{ playButtonLabel }}
            </button-base>
          </transition>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournament } from '@skeleton/api/types';
  import type { ITournamentCommon, ITournamentPage } from '~/types';
  import { participateTournament } from '@skeleton/api/retention';

  const props = defineProps<{
    tournamentData: ITournament;
    tournamentContent: Maybe<ITournamentPage>;
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
    gamesCount?: number;
  }>();

  const emit = defineEmits(['statusChanged', 'goToGames']);
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal } = useModalStore();
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const { showAlert } = useLayoutStore();
  const dayjs = useDayjs();
  const isFinished = [4, 5].includes(props.tournamentData.state);

  const actionState = computed(() => {
    if (!isLoggedIn.value) return 'register';
    if (!props.tournamentData.hasOwnProperty('playerEntry')) return undefined;
    if (props.tournamentData.playerEntry || !props.tournamentData.confirmationRequired) return 'play';
    return 'takePart';
  });

  const playButtonLabel = computed(() => {
    if (!actionState.value) return '';
    if (actionState.value === 'register') {
      return getContent(
        props.currentLocaleCommonContent,
        props.defaultLocaleCommonContent,
        'main.buttonLabels.register'
      );
    }
    if (actionState.value === 'play') {
      return getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.buttonLabels.play');
    }
    return getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.buttonLabels.takePart');
  });

  const participating = ref(false);
  const getParticipate = async (): Promise<void> => {
    if (participating.value) return;
    participating.value = true;

    try {
      await participateTournament(props.tournamentData.id);
      emit('goToGames');
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    participating.value = false;
  };

  const handleAction = async (): Promise<void> => {
    if (!actionState.value) return;
    else if (actionState.value === 'register') await openModal('sign-up');
    else if (actionState.value === 'play') emit('goToGames');
    else await getParticipate();
  };
</script>

<style src="~/assets/styles/components/tournament/banner.scss" lang="scss" />
