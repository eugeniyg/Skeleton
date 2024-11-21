<template>
  <div class="quest-tab">
    <div v-if="issuedQuests.length" class="quest-tab__items">
      <quest-card
        v-for="(quest, questIndex) in issuedQuests"
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
  const { issuedQuests } = storeToRefs(questsStore);
  const globalStore = useGlobalStore();
  const { popupsData, defaultLocalePopupsData } = storeToRefs(globalStore);
  const { getContent } = useProjectMethods();

  const emptyContentData = computed(() => {
    const image = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.empty.image');
    const title = getContent(popupsData.value, defaultLocalePopupsData.value, 'questsHub.empty.availableTitle');
    const description = getContent(
      popupsData.value,
      defaultLocalePopupsData.value,
      'questsHub.empty.availableDescription'
    );
    return { image, title, description };
  });
</script>

<style src="~/assets/styles/components/quest/tab.scss" lang="scss" />
