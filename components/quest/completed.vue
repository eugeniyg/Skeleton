<template>
  <div class="quest-tab">
    <div v-if="state.data.length" class="quest-tab__items">
      <quest-card
        v-for="(quest, questIndex) in state.data"
        :questInfo="quest"
        :questIndex="questIndex"
      />

      <button-base
        v-if="state.meta && state.meta.page < state.meta.totalPages"
        size="xs"
        type="ghost"
        class="quest-tab__load-more"
        @click="getData"
      >
        {{ getContent(popupsData, defaultLocalePopupsData, 'questsHub.loadLabel') }}
      </button-base>
    </div>

    <quest-empty v-else-if="!state.loading" v-bind="emptyContentData" />
  </div>
</template>

<script setup lang="ts">
import type {IPaginationMeta, IPlayerQuest} from "@skeleton/core/types";

const globalStore = useGlobalStore();
const {
  popupsData,
  defaultLocalePopupsData,
  alertsData,
  defaultLocaleAlertsData
} = storeToRefs(globalStore);
const { getContent } = useProjectMethods();

interface IState {
  loading: boolean;
  data: IPlayerQuest[];
  meta: Maybe<IPaginationMeta>;
}

const state = reactive<IState>({
  loading: false,
  data: [],
  meta: undefined,
});

const { getPlayerQuests } = useCoreQuestApi();
const { showAlert } = useLayoutStore();
const getData = async (): Promise<void> => {
  if (state.loading || (state.meta && state.meta.page >= state.meta.totalPages)) return;
  state.loading = true;

  try {
    const { data, meta } = await getPlayerQuests({
      page: state.meta?.page ? state.meta.page + 1 : 1,
      perPage: 3,
      state: [3,4]
    });
    state.data = [...state.data, ...data];
    state.meta = meta;
  } catch {
    state.data = [];
    state.meta = undefined;
    showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
  } finally {
    state.loading = false;
  }
}

const emptyContentData = computed(() => {
  const image = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.empty.image');
  const title = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.empty.completedTitle');
  const description = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.empty.completedDescription');
  return { image, title, description };
})

onMounted(async () => {
  await getData();
});
</script>

<style src="~/assets/styles/components/quest/tab.scss" lang="scss"/>