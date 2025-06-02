<template>
  <div class="quest-games">
    <div class="quest-games__header">
      <div class="quest-games__header-title">
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'gamesLabel') }}
      </div>

      <div
        v-if="gamesData.length > filteredGamesData.length"
        class="quest-games__header-all-btn"
        @click="openGamesModal"
      >
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'seeAllLabel') }}
      </div>
    </div>

    <div class="quest-games__items">
      <template v-if="gamesData.length">
        <div v-for="game in filteredGamesData" :key="game.id" class="quest-games__item" @click.once="goToGame(game)">
          <atomic-image :src="getImageUrl(game.customImages, game.images, 'square')" />
        </div>
      </template>

      <div v-else-if="!loadGames" class="quest-games__all-games">
        {{ getContent(questTasksContent, defaultLocaleQuestTasksContent, 'allGamesLabel') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IGame } from '@skeleton/core/types';
  import type { IQuestTasksModal } from '~/types';

  const props = defineProps<{
    items: string[];
    taskType: number;
  }>();

  const questTasksContent: Maybe<IQuestTasksModal> = inject('questTasksContent');
  const defaultLocaleQuestTasksContent: Maybe<IQuestTasksModal> = inject('defaultLocaleQuestTasksContent');

  const { getContent, getImageUrl, localizePath } = useProjectMethods();
  const globalStore = useGlobalStore();
  const { headerCountry, isMobile } = storeToRefs(globalStore);

  const visibleItems = ref(0);
  const gamesData = ref<IGame[]>([]);
  const filteredGamesData = computed(() => {
    return gamesData.value.slice(0, visibleItems.value);
  });
  const { getFilteredGames } = useCoreGamesApi();
  const loadGames = ref(false);
  const getConditionGames = async (): Promise<void> => {
    loadGames.value = true;
    try {
      const { data } = await getFilteredGames({
        identity: props.items,
        countries: headerCountry.value ? [headerCountry.value] : undefined,
        sortBy: 'score',
        sortOrder: 'asc',
      });

      gamesData.value = data;
    } catch {
      console.error('Something went wrong with games loading!');
    }
    loadGames.value = false;
  };

  const router = useRouter();
  const { closeAllModals, openModal } = useModalStore();
  const goToGame = async (game: IGame): Promise<void> => {
    await closeAllModals();
    await router.push(localizePath(`/games/${game.identity}?real=true`));
  };

  const setVisibleItems = (): void => {
    if (props.taskType === 3) visibleItems.value = isMobile.value ? 6 : 4;
    else if (props.taskType === 4) visibleItems.value = isMobile.value ? 3 : 6;
    else visibleItems.value = 3;
  };

  const openGamesModal = (): void => {
    openModal('quest-task-games', { props: { games: gamesData } });
  };

  onMounted(async () => {
    if (!props.items.length) return;
    setVisibleItems();
    await getConditionGames();
  });
</script>

<style src="~/assets/styles/components/quest/games.scss" lang="scss" />
