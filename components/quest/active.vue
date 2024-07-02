<template>
  <div class="quest-tab">
    <div v-if="playerActiveQuests.length" class="quest-tab__items">
      <quest-card
        v-for="(quest, questIndex) in playerActiveQuests"
        :questInfo="quest"
        :questIndex="questIndex"
      />
    </div>

    <atomic-empty
      v-else
      title="0 Active quests"
      subTitle="Hey, you didn’t have any active quests"
      variant="quest"
    />
  </div>
</template>

<script setup lang="ts">
  const questsStore = useQuestsStore();
  const { playerActiveQuests } = storeToRefs(questsStore);
</script>

<style src="~/assets/styles/components/quest/tab.scss" lang="scss"/>