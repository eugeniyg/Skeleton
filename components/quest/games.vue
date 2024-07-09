<template>
  <div v-if="gamesData.length" class="quest-games">
    <div class="quest-games__header">
      <div class="quest-games__header-title">
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.gamesLabel') }}
      </div>

      <div
        v-if="gamesData.length > filteredGamesData.length"
        class="quest-games__header-all-btn"
        @click="showGamesModal = true"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'questTasks.seeAllLabel') }}
      </div>

      <modal-quest-task-games
        :showModal="showGamesModal"
        :games="gamesData"
        @closeModal="showGamesModal = false"
      />
    </div>

    <div class="quest-games__items">
      <div
        v-for="game in filteredGamesData"
        :key="game.id"
        class="quest-games__item"
        @click.once="goToGame(game)"
      >
        <atomic-image v-if="game.images['200x200']" :src="getImageUrl(game.images, 'square')" />
        <atomic-image v-else src="/img/default-game-tumb.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type {IGame} from "@skeleton/core/types";

  const props = defineProps<{
    items: string[];
    taskType: number;
  }>();

  const { getContent, getImageUrl, localizePath } = useProjectMethods();
  const globalStore = useGlobalStore();
  const {
    popupsData,
    defaultLocalePopupsData,
    headerCountry,
    isMobile
  } = storeToRefs(globalStore);

  const showGamesModal = ref(false);
  const visibleItems = ref(0);
  const gamesData = ref<IGame[]>([]);
  const filteredGamesData = computed(() => {
    return gamesData.value.slice(0, visibleItems.value);
  });
  const { getFilteredGames } = useCoreGamesApi();
  const getConditionGames = async (): Promise<void> => {
    try {
      const { data } = await getFilteredGames({
        identity: props.items,
        countries: headerCountry.value ? [headerCountry.value] : undefined,
        sortBy: 'default',
        sortOrder: 'asc'
      });

      gamesData.value = data;
    } catch {
      console.error('Something went wrong with games loading!')
    }
  }

  const router = useRouter();
  const { closeModal } = useLayoutStore();
  const { closeTasksModal } = useQuestsStore();
  const goToGame = (game: IGame): void => {
    closeTasksModal();
    closeModal('questsHub');
    router.push(localizePath(`/games/${game.identity}?real=true`));
  }

  const setVisibleItems = (): void => {
    if (props.taskType === 3) visibleItems.value = isMobile.value ? 6 : 4;
    else if (props.taskType === 4) visibleItems.value = isMobile.value ? 3 : 6;
    else visibleItems.value = 3;
  }

  onMounted(async () => {
    setVisibleItems();
    await getConditionGames();
  })
</script>

<style src="~/assets/styles/components/quest/games.scss" lang="scss"/>