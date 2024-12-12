<template>
  <div class="tournament-games">
    <div class="tournament-games__header">
      <atomic-icon v-if="titleIcon" :id="titleIcon" />
      <h2 class="tournament-games__title">
        {{ getContent(props.currentLocaleCommonContent, defaultLocaleCommonContent, 'games.title') }}
      </h2>
      <div class="tournament-games__total-rows">{{ gamesCount }}</div>
    </div>

    <div class="tournament-games__items">
      <card-base v-for="game in props.gamesData" :key="game.id" :game-info="game" />
    </div>

    <button-base
      v-if="props.gamesMeta.page < props.gamesMeta.totalPages"
      class="tournament-games__more"
      :class="{ loading: props.gamesLoading }"
      type="ghost"
      size="sm"
      @click="emit('getMoreGames', props.gamesMeta.page + 1)"
    >
      {{ getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'games.more') }}
      <atomic-icon id="reset" />
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type { IGame, IPaginationMeta } from '@skeleton/core/types';
  import type { ITournamentCommon } from '~/types';

  const props = defineProps<{
    gamesData: IGame[];
    gamesMeta: IPaginationMeta;
    currentLocaleCommonContent: Maybe<ITournamentCommon>;
    defaultLocaleCommonContent: Maybe<ITournamentCommon>;
    gamesLoading: boolean;
  }>();

  const emit = defineEmits(['getMoreGames']);
  const { getContent } = useProjectMethods();
  const titleIcon = computed(() =>
    getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'games.icon')
  );
  const gamesCount = computed(() => {
    const labelContent =
      getContent(props.currentLocaleCommonContent, props.defaultLocaleCommonContent, 'games.count') || '';
    return labelContent.replace('{count}', props.gamesMeta.totalRows);
  });
</script>

<style src="~/assets/styles/components/tournament/games.scss" lang="scss" />
