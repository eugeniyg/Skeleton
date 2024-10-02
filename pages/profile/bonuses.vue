<template>
  <div class="content profile-bonuses">
    <div class="header">
      <h1 class="heading">
        {{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}
      </h1>
    </div>

    <nuxt-link
      class="link-bonus"
      :to="localizePath('/profile/history?tab=bonuses')"
    >
      {{ getContent(currentLocaleContent, defaultLocaleContent, 'historyLink') }}
    </nuxt-link>

    <bonus-code
      :content="getContent(currentLocaleContent, defaultLocaleContent, 'bonusCode')"
    />

    <transition name="fade" mode="out-in">
      <bonus-active
        v-if="activePlayerBonuses.length"
        bonusType="bonus"
        :content="getContent(currentLocaleContent, defaultLocaleContent, 'cashBonuses')"
        @showCancelLock="showBonusCancelLockModal = true"
      />
    </transition>

    <transition name="fade" mode="out-in">
      <bonus-active
        v-if="activePlayerFreeSpins.length"
        bonusType="free-spin"
        :content="getContent(currentLocaleContent, defaultLocaleContent, 'freeSpins')"
        @showCancelLock="showBonusCancelLockModal = true"
      />
    </transition>

    <modal-bonus-cancel-lock
      :showModal="showBonusCancelLockModal"
      :content="getContent(currentLocaleContent, defaultLocaleContent, 'cancelLockModal')"
      @close="showBonusCancelLockModal = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileBonuses } from '~/types';

  const bonusStore = useBonusStore();
  const { localizePath, getContent } = useProjectMethods();
  const { getPlayerBonuses, getPlayerFreeSpins } = bonusStore;
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);

  const { currentLocaleContent, defaultLocaleContent } = await useContentLogic<IProfileBonuses>({
    contentKey: 'profileBonusesContent',
    contentRoute: ['profile', 'bonuses'],
    isPage: true
  });

  const showBonusCancelLockModal = ref(false);

  onMounted(() => {
    getPlayerBonuses();
    getPlayerFreeSpins();
  })
</script>

<style src="~/assets/styles/pages/profile/bonuses.scss" lang="scss" />
