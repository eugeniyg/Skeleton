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
              <span>{{ props.tournamentDefiniteData.prizes[(leader.place ?? 0) - 1]?.title || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <atomic-pagination
      v-if="pageMeta?.totalPages && pageMeta.totalPages > 1"
      v-bind="pageMeta"
      @select-page="changePage"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ITournamentCommon } from '~/types';
  import type { ITournamentDefinite } from '@skeleton/core/types/tournamentsTypes';
  import type { IPaginationMeta } from '@skeleton/core/types';

  const props = defineProps<{
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
    tournamentDefiniteData: ITournamentDefinite;
  }>();

  const { getContent } = useProjectMethods();
  const rewardImage = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'leaderboard.table.prizeIcon')
  );
  const profileStore = useProfileStore();
  const { isLoggedIn, profile } = storeToRefs(profileStore);

  const pageMeta = reactive<IPaginationMeta>({
    page: 1,
    perPage: 15,
    totalPages: Math.ceil(props.tournamentDefiniteData.leaderboard.slice(3).length / 15),
    totalRows: props.tournamentDefiniteData.leaderboard.slice(3).length,
  });

  const currentList = computed(() => {
    const firstListElement = 3 + (pageMeta.page - 1) * pageMeta.perPage;
    const pageList = props.tournamentDefiniteData.leaderboard.slice(
      firstListElement,
      firstListElement + pageMeta.perPage
    );
    return pageList;
  });

  const rootComponent = ref();
  const changePage = (page: number) => {
    pageMeta.page = page;
    if (rootComponent.value) {
      const topOffset = rootComponent.value.offsetTop;
      window.scrollTo({ top: topOffset - 260, behavior: 'smooth' });
    }
  };
</script>

<style src="~/assets/styles/components/tournament/leaderboard.scss" lang="scss" />
