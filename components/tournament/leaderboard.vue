<template>
  <div ref="rootComponent" class="tournament-leaderboard">
    <div class="tournament-leaderboard__tb-container">
      <div class="tournament-leaderboard__tb">
        <div class="tournament-leaderboard__tb-head">
          <div class="tournament-leaderboard__tb-th">
            {{
              getContent(
                props.currentLocaleCommonContent,
                props.defaultLocaleCommonContent,
                'leaderboard.table.position'
              )
            }}
          </div>

          <div class="tournament-leaderboard__tb-th">
            {{
              getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.table.player')
            }}
          </div>

          <div class="tournament-leaderboard__tb-th">
            {{
              getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.table.points')
            }}
          </div>

          <div class="tournament-leaderboard__tb-th">
            {{
              getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.table.prize')
            }}
          </div>
        </div>

        <div class="tournament-leaderboard__tb-body">
          <div
            v-for="leader in currentList"
            :key="leader.playerId"
            class="tournament-leaderboard__tb-row"
            :class="{ 'is-accented': leader.playerId === profile?.id }"
          >
            <div class="tournament-leaderboard__tb-td">{{ leader.place }}</div>
            <div class="tournament-leaderboard__tb-td">{{ leader.nickname || 'unknown' }}</div>
            <div class="tournament-leaderboard__tb-td">{{ leader.points }}</div>
            <div class="tournament-leaderboard__tb-td">
              <atomic-image v-if="rewardImage" :src="rewardImage" />

              <span v-if="props.tournamentDefiniteData.prizes?.[(leader.place ?? 0) - 1]?.title">
                {{ props.tournamentDefiniteData.prizes[leader.place - 1].title }}
              </span>

              <span v-else class="is-empty">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <atomic-pagination
      v-if="totalPages && totalPages > 1"
      v-bind="{
        page: currentPage,
        perPage,
        totalPages,
        totalRows,
      }"
      @select-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentCommon } from '~/types';
  import type { ITournament, ITournamentParticipant } from '@skeleton/core/types/tournamentsTypes';

  const props = defineProps<{
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
    tournamentDefiniteData: ITournament;
  }>();

  const { getContent } = useProjectMethods();
  const rewardImage = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.table.prizeIcon')
  );
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const currentPage = ref(1);
  const perPage = 14;
  const totalPages = computed(() => {
    if (props.tournamentDefiniteData.state > 3 && props.tournamentDefiniteData.prizes) {
      return Math.ceil(props.tournamentDefiniteData.prizes.slice(3).length / 15);
    } else if (props.tournamentDefiniteData.leaderboard) {
      return Math.ceil(props.tournamentDefiniteData.leaderboard.slice(3).length / 15);
    } else return 0;
  });
  const totalRows = computed(() => {
    if (props.tournamentDefiniteData.state > 3) return props.tournamentDefiniteData.prizes?.slice(3).length || 0;
    return props.tournamentDefiniteData.leaderboard?.slice(3).length || 0;
  });

  const currentList = computed(() => {
    const firstListElement = 3 + (currentPage.value - 1) * perPage;
    let pageList: ITournamentParticipant[] = [];
    if (props.tournamentDefiniteData.state > 3 && props.tournamentDefiniteData.prizes) {
      pageList = props.tournamentDefiniteData.prizes.slice(firstListElement, firstListElement + perPage).map(prize => ({
        playerId: prize.entry?.playerId as string,
        nickname: prize.entry?.nickname || null,
        points: prize.entry?.points as number,
        place: prize.place as number,
      }));
    } else if (props.tournamentDefiniteData.state === 3 && props.tournamentDefiniteData.leaderboard) {
      pageList = props.tournamentDefiniteData.leaderboard.slice(firstListElement, firstListElement + perPage);
    }

    if (props.tournamentDefiniteData.playerEntry?.points) {
      if (props.tournamentDefiniteData.playerEntry?.place > pageList[pageList.length - 1].place) {
        pageList.push({
          playerId: profile.value?.id as string,
          nickname: profile.value?.nickname || '',
          points: props.tournamentDefiniteData.playerEntry.points,
          place: props.tournamentDefiniteData.playerEntry.place,
        });
      }
    }

    return pageList;
  });

  const rootComponent = ref();
  const changePage = (page: number) => {
    currentPage.value = page;
    if (rootComponent.value) {
      const topOffset = rootComponent.value.offsetTop;
      window.scrollTo({ top: topOffset - 260, behavior: 'smooth' });
    }
  };
</script>

<style src="~/assets/styles/components/tournament/leaderboard.scss" lang="scss" />
