<template>
  <div class="quest-hub">
    <div class="quest-hub__header">
      <h2 class="quest-hub__heading">
        {{ getContent(infoContent, defaultLocaleInfoContent, 'questHub.title') }}
      </h2>

      <button-base
        class="quest-hub__desktop-history-btn"
        type="ghost"
        size="xs"
        @click="showModal('questHub')"
      >
        {{ getContent(infoContent, defaultLocaleInfoContent, 'questHub.historyLabel') }}
      </button-base>
    </div>

    <quest-accumulated-rewards />

    <div
      v-if="questHubCards?.length"
      class="quest-hub__cards"
    >
      <quest-hub-card
        v-for="(card, index) in questHubCards"
        v-bind="card"
        :show-divider="index < questHubCards.length - 1"
      />
    </div>

    <button-base
      class="quest-hub__mobile-history-btn"
      type="ghost"
      size="xs"
      @click="showModal('questHub')"
    >
      See history
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import type {IProfileInfo} from "~/types";

  const { getContent } = useProjectMethods();
  const infoContent = ref<Maybe<IProfileInfo>>(inject('infoContent'));
  const defaultLocaleInfoContent = ref<Maybe<IProfileInfo>>(inject('defaultLocaleInfoContent'));
  const questHubCards = [];

  // const questHubCards = [
  //   {
  //     title: 'Multiplayer Master',
  //     img: '/img/quest/1.png',
  //     wins: [
  //       {
  //         isActive: true,
  //         amount: '0.00000013',
  //         currency: 'mBTC',
  //       },
  //       {
  //         amount: '185.000',
  //         currency: 'GLD',
  //       },
  //       {
  //         amount: '300.000',
  //         currency: 'GLD'
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Multiplayer Master',
  //     img: '/img/quest/1.png',
  //     wins: [
  //       {
  //         isActive: true,
  //         amount: '0.00000013',
  //         currency: 'mBTC',
  //       },
  //       {
  //         amount: '185.000',
  //         currency: 'GLD',
  //       },
  //       {
  //         amount: '300.000',
  //         currency: 'GLD'
  //       }
  //     ]
  //   },
  //   {
  //     title: 'Multiplayer Master',
  //     img: '/img/quest/1.png',
  //     wins: [
  //       {
  //         isActive: true,
  //         amount: '0.00000013',
  //         currency: 'mBTC',
  //       },
  //       {
  //         amount: '185.000',
  //         currency: 'GLD',
  //       },
  //       {
  //         amount: '300.000',
  //         currency: 'GLD'
  //       }
  //     ]
  //   },
  // ];
  const { showModal } = useLayoutStore();
</script>

<style src="~/assets/styles/components/quest/hub.scss" lang="scss"/>