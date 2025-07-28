<template>
  <div class="quest-tab">
    <div v-if="activeQuests.length" class="quest-tab__items">
      <quest-card
        v-for="(quest, questIndex) in activeQuests"
        :key="quest.id"
        :quest-info="quest"
        :quest-index="questIndex"
      />
    </div>

    <quest-empty v-else v-bind="emptyContentData" />
  </div>
</template>

<script setup lang="ts">
  import type { IQuestsHubModal } from '~/types';

  const questsHubContent: Maybe<IQuestsHubModal> = inject('questsHubContent');
  const defaultLocaleQuestsHubContent: Maybe<IQuestsHubModal> = inject('defaultLocaleQuestsHubContent');
  const questsStore = useQuestsStore();
  const { activeQuests } = storeToRefs(questsStore);

  const emptyContentData = computed(() => {
    const image = getContent(questsHubContent, defaultLocaleQuestsHubContent, 'empty.image');
    const title = getContent(questsHubContent, defaultLocaleQuestsHubContent, 'empty.activeTitle');
    const description = getContent(questsHubContent, defaultLocaleQuestsHubContent, 'empty.activeDescription');
    return { image, title, description };
  });
</script>

<style src="~/assets/styles/components/quest/tab.scss" lang="scss" />
