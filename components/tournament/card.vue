<template>
  <div class="tournament-card" :class="{ 'tournament-card--finished': props.isFinished }">
    <div class="tournament-card__container">
      <tournament-timer
        :key="`${props.tournamentData.startAt || 'start'}-${props.tournamentData.endAt || 'finish'}`"
        :tournamentData="props.tournamentData"
        :currentLocaleCommonContent="props.currentLocaleCommonContent"
        :defaultLocaleCommonContent="props.defaultLocaleCommonContent"
        @tournamentStarted="emit('tournamentStarted')"
        @tournamentFinished="emit('tournamentFinished')"
      />

      <div class="tournament-card__content">
        <div class="tournament-card__title">{{ props.tournamentContent?.name }}</div>
        <div class="tournament-card__sub-title">{{ props.tournamentContent?.reward }}</div>
      </div>

      <atomic-image
        v-if="props.tournamentContent?.image"
        class="tournament-card__img"
        :src="props.tournamentContent.image"
      />

      <div v-if="[2, 3].includes(props.tournamentData.state)" class="tournament-card__actions">
        <button-base v-if="isLoggedIn" type="primary" size="md" :url="`/tournaments/${props.tournamentData.identity}`">
          {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.buttonLabels.play') }}
        </button-base>

        <template v-else>
          <button-base type="primary" size="md" @click="openModal('sign-up')">
            {{
              getContent(
                props.currentLocaleCommonContent,
                props.defaultLocaleCommonContent,
                'main.buttonLabels.register'
              )
            }}
          </button-base>

          <button-base type="ghost" size="md" :url="`/tournaments/${props.tournamentData.identity}`">
            {{
              getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.buttonLabels.more')
            }}
          </button-base>
        </template>
      </div>

      <div v-else-if="[4, 5].includes(props.tournamentData.state)" class="tournament-card__actions">
        <button-base type="secondary" size="md" :url="`/tournaments/${props.tournamentData.identity}?finished=true`">
          {{
            getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'main.buttonLabels.results')
          }}
        </button-base>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITournament } from '@skeleton/core/types/tournamentsTypes';
  import type { ITournamentCommon, ITournamentPage } from '~/types';

  const props = defineProps<{
    tournamentData: ITournament;
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
    tournamentContent: Maybe<ITournamentPage>;
    isFinished?: boolean;
  }>();

  const emit = defineEmits(['tournamentStarted', 'tournamentFinished']);
  const { openModal } = useModalStore();
  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { getContent } = useProjectMethods();
</script>

<style src="~/assets/styles/components/tournament/card.scss" lang="scss" />
