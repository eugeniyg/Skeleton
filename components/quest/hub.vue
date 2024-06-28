<template>
  <div class="quest-hub">
    <div class="quest-hub__header">
      <h2 class="quest-hub__heading">
        {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.title') }}
      </h2>

      <button-base
        class="quest-hub__desktop-history-btn"
        type="ghost"
        size="xs"
        @click="showModal('questsHub')"
      >
        {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.historyLabel') }}
      </button-base>
    </div>

    <div
      v-if="playerActiveQuests.length"
      class="quest-hub__cards"
    >
      <quest-hub-card
        v-for="(quest, index) in playerActiveQuests"
        :questInfo="quest"
        :cardIndex="index"
        @openRewardsModal="openRewardsModal"
      />
    </div>

    <quest-empty-active v-else />

    <modal-quest-rewards
      v-bind="rewardsState"
      :title="getContent(infoContent, defaultLocaleInfoContent, 'questsHub.rewardsTitle')"
      @closeModal="rewardsState.showModal = false"
    />

    <button-base
      class="quest-hub__mobile-history-btn"
      type="ghost"
      size="xs"
      @click="showModal('questsHub')"
    >
      {{ getContent(infoContent, defaultLocaleInfoContent, 'questsHub.historyLabel') }}
    </button-base>

  </div>
</template>

<script setup lang="ts">
  import type {IProfileInfo} from "~/types";

  const rewardsState = reactive<{
    showModal: boolean;
    rewardsList: { currency: string, amount: number }[];
  }>({
    showModal: false,
    rewardsList: [],
  });
  const { getContent } = useProjectMethods();
  const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));
  const questsStore = useQuestsStore();
  const { playerActiveQuests } = storeToRefs(questsStore);
  const { showModal } = useLayoutStore();

  const openRewardsModal = (rewards: { currency: string, amount: number }[]) => {
    rewardsState.rewardsList = rewards;
    rewardsState.showModal = true;
  }
</script>

<style src="~/assets/styles/components/quest/hub.scss" lang="scss"/>