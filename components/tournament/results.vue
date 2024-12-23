<template>
  <div class="tournament-results">
    <div class="tournament-results__header">
      {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.title') }}
    </div>

    <div class="tournament-results__places">
      <div class="tournament-results__places-item">
        <atomic-image
          class="tournament-results__places-item-img"
          :src="
            getContent(
              props.currentLocaleCommonContent,
              props.defaultLocaleCommonContent,
              'leaderboard.secondPlaceImage'
            )
          "
          defaultImage="/img/tournaments/thropy-2.png"
        />

        <div class="tournament-results__places-item-flex">
          <div class="tournament-results__places-item-title">
            2. {{ winnersList[1]?.nickname || winnersDefaultNickname }}
          </div>

          <div class="tournament-results__places-item-points">
            {{ winnersList[1]?.points ?? '-' }} {{ pointsContent }}
          </div>
        </div>

        <div class="tournament-results__places-item-prize">{{ props.tournamentDefiniteData?.prizes?.[1]?.title }}</div>
      </div>

      <div class="tournament-results__places-item">
        <atomic-image
          class="tournament-results__places-item-img"
          :src="
            getContent(
              props.currentLocaleCommonContent,
              props.defaultLocaleCommonContent,
              'leaderboard.firstPlaceImage'
            )
          "
          defaultImage="/img/tournaments/thropy-1.png"
        />

        <div class="tournament-results__places-item-flex">
          <div class="tournament-results__places-item-title">
            1. {{ winnersList[0]?.nickname || winnersDefaultNickname }}
          </div>

          <div class="tournament-results__places-item-points">
            {{ winnersList[0]?.points ?? '-' }} {{ pointsContent }}
          </div>
        </div>

        <div class="tournament-results__places-item-prize">{{ props.tournamentDefiniteData?.prizes?.[0]?.title }}</div>
      </div>

      <div class="tournament-results__places-item">
        <atomic-image
          class="tournament-results__places-item-img"
          :src="
            getContent(
              props.currentLocaleCommonContent,
              props.defaultLocaleCommonContent,
              'leaderboard.thirdPlaceImage'
            )
          "
          defaultImage="/img/tournaments/thropy-3.png"
        />
        <div class="tournament-results__places-item-flex">
          <div class="tournament-results__places-item-title">
            3. {{ winnersList[2]?.nickname || winnersDefaultNickname }}
          </div>

          <div class="tournament-results__places-item-points">
            {{ winnersList[2]?.points ?? '-' }} {{ pointsContent }}
          </div>
        </div>

        <div class="tournament-results__places-item-prize">{{ props.tournamentDefiniteData?.prizes?.[2]?.title }}</div>
      </div>
    </div>

    <tournament-leaderboard
      v-if="props.tournamentDefiniteData && hasLeaderboardLength"
      :currentLocaleCommonContent="props.currentLocaleCommonContent"
      :defaultLocaleCommonContent="props.defaultLocaleCommonContent"
      :tournamentDefiniteData="props.tournamentDefiniteData"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentCommon } from '~/types';
  import type { ITournament } from '@skeleton/core/types/tournamentsTypes';

  const props = defineProps<{
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
    tournamentDefiniteData: Maybe<ITournament>;
  }>();

  const { getContent } = useProjectMethods();
  const winnersDefaultNickname = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.defaultNickname')
  );
  const pointsContent = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.pointsLabel')
  );

  const hasLeaderboardLength = computed(() => {
    const leaderboardLength = (props.tournamentDefiniteData?.leaderboard?.length ?? 0) > 3;
    const prizesLength = (props.tournamentDefiniteData?.prizes?.length ?? 0) > 3;
    return leaderboardLength || prizesLength;
  });

  const winnersList = computed(() => {
    if (!props.tournamentDefiniteData) return [];
    if (props.tournamentDefiniteData.state === 3) {
      return props.tournamentDefiniteData.leaderboard?.slice(0, 3) || [];
    } else if ([4, 5].includes(props.tournamentDefiniteData.state)) {
      const winnersPrizes = props.tournamentDefiniteData.prizes?.slice(0, 3) || [];
      return winnersPrizes.map(prize => ({
        ...prize.entry,
        place: prize.place,
      }));
    } else return [];
  });
</script>

<style src="~/assets/styles/components/tournament/results.scss" lang="scss" />
