<template>
  <div class="quest-hub">
    <div class="quest-hub__header">
      <h2 class="quest-hub__heading">
        {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.title') }}
      </h2>

      <button-base class="quest-hub__desktop-history-btn" type="ghost" size="xs" @click="openModal('quests-hub')">
        {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.historyLabel') }}
      </button-base>
    </div>

    <div v-if="activeQuests.length" class="quest-hub__cards">
      <quest-hub-card v-for="(quest, index) in activeQuests" :key="index" :quest-info="quest" :card-index="index" />
    </div>

    <quest-empty v-else v-bind="infoContent?.questsHub?.empty || defaultLocaleInfoContent?.questsHub?.empty" />

    <button-base class="quest-hub__mobile-history-btn" type="ghost" size="xs" @click="openModal('quests-hub')">
      {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.historyLabel') }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type { IProfileInfo } from '~/types';

  const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));
  const questsStore = useQuestsStore();
  const { activeQuests } = storeToRefs(questsStore);
  const { openModal } = useModalStore();
</script>

<style src="~/assets/styles/components/quest/hub.scss" lang="scss" />
