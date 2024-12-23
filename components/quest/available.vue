<template>
  <div class="quest-tab">
    <div v-if="state.data.length" class="quest-tab__items">
      <quest-card
        v-for="(quest, questIndex) in state.data"
        :key="quest.id"
        :quest-info="quest"
        :quest-index="questIndex"
      />

      <button-base
        v-if="state.meta && state.meta.page < state.meta.totalPages"
        size="xs"
        type="ghost"
        class="quest-tab__load-more"
        @click="getData(state.meta.page + 1)"
      >
        {{ getContent(questsHubContent, defaultLocaleQuestsHubContent, 'loadLabel') }}
      </button-base>
    </div>

    <quest-empty v-else v-bind="emptyContentData" />
  </div>
</template>

<script setup lang="ts">
  import type { IPaginationMeta, IPlayerQuest } from '@skeleton/core/types';
  import type { IQuestsHubModal } from '~/types';

  const questsHubContent: Maybe<IQuestsHubModal> = inject('questsHubContent');
  const defaultLocaleQuestsHubContent: Maybe<IQuestsHubModal> = inject('defaultLocaleQuestsHubContent');
  const globalStore = useGlobalStore();
  const { alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
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

  const { getAvailableQuests } = useCoreQuestApi();
  const { showAlert } = useLayoutStore();
  const getData = async (page = 1): Promise<void> => {
    if (state.loading) return;
    state.loading = true;

    try {
      const { activeAccount } = useWalletStore();
      const { data, meta } = await getAvailableQuests({
        page: page,
        perPage: 5,
        currency: activeAccount?.currency,
      });
      state.data = page === 1 ? data : [...state.data, ...data];
      state.meta = meta;
    } catch {
      state.data = [];
      state.meta = undefined;
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    } finally {
      state.loading = false;
    }
  };

  const emptyContentData = computed(() => {
    const image = getContent(questsHubContent, defaultLocaleQuestsHubContent, 'empty.image');
    const title = getContent(questsHubContent, defaultLocaleQuestsHubContent, 'empty.availableTitle');
    const description = getContent(questsHubContent, defaultLocaleQuestsHubContent, 'empty.availableDescription');
    return { image, title, description };
  });

  onMounted(() => {
    useListen('questActivated', getData);
    getData();
  });

  onBeforeUnmount(() => {
    useUnlisten('questActivated', getData);
  });
</script>

<style src="~/assets/styles/components/quest/tab.scss" lang="scss" />
