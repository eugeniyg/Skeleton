<template>
  <div class="quest-tab">
    <div v-if="playerActiveQuests.length" class="quest-tab__items">
      <quest-card
        v-for="(quest, questIndex) in playerActiveQuests"
        :key="quest.id"
        :quest-info="quest"
        :quest-index="questIndex"
      />
    </div>

    <quest-empty v-else v-bind="emptyContentData" />
  </div>
</template>

<script setup lang="ts">
  const questsStore = useQuestsStore();
  const { playerActiveQuests } = storeToRefs(questsStore);
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const emptyContentData = computed(() => {
    const image = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.empty.image');
    const title = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.empty.activeTitle');
    const description = getContent(
      popupsData.value,
      defaultLocalePopupsData.value,
      'questsHub.empty.activeDescription'
    );
    return { image, title, description };
  });
</script>

<style src="~/assets/styles/components/quest/tab.scss" lang="scss" />
