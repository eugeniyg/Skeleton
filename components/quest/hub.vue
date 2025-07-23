<template>
  <div class="quest-hub">
    <div class="quest-hub__header">
      <h2 class="quest-hub__heading">
        {{ getContent(personalContent, defaultLocalePersonalContent, 'questsHub.title') }}
      </h2>

      <button-base class="quest-hub__desktop-history-btn" type="ghost" size="xs" @click="openModal('quests-hub')">
        {{ getContent(personalContent, defaultLocalePersonalContent, 'questsHub.historyLabel') }}
      </button-base>
    </div>

    <div v-if="activeQuests.length" class="quest-hub__cards">
      <quest-hub-card v-for="(quest, index) in activeQuests" :key="index" :quest-info="quest" :card-index="index" />
    </div>

    <quest-empty v-else v-bind="personalContent?.questsHub?.empty || defaultLocalePersonalContent?.questsHub?.empty" />

    <button-base class="quest-hub__mobile-history-btn" type="ghost" size="xs" @click="openModal('quests-hub')">
      {{ getContent(personalContent, defaultLocalePersonalContent, 'questsHub.historyLabel') }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type { IProfilePersonal } from '~/types';

  const personalContent = ref<Maybe<IProfilePersonal>>(inject('personalContent'));
  const defaultLocalePersonalContent = ref<Maybe<IProfilePersonal>>(inject('defaultLocalePersonalContent'));
  const questsStore = useQuestsStore();
  const { activeQuests } = storeToRefs(questsStore);
  const { openModal } = useModalStore();
</script>

<style src="~/assets/styles/components/quest/hub.scss" lang="scss" />
