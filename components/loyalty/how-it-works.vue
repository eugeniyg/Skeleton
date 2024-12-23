<template>
  <div class="loyalty-how-it-works">
    <div class="loyalty-how-it-works__title">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'howItWorks.title') }}
    </div>

    <div class="loyalty-how-it-works__description">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'howItWorks.description') }}
    </div>

    <div class="loyalty-how-it-works__container">
      <atomic-image
        :src="getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'howItWorks.image')"
        class="loyalty-how-it-works__image"
      />

      <ul v-if="listItems.length" class="loyalty-how-it-works__list">
        <li
          v-for="(item, index) in listItems"
          :key="index"
          class="loyalty-how-it-works__list-item"
          :class="{ 'is-numeric': !item.image }"
        >
          <atomic-image v-if="item.image" class="loyalty-how-it-works__list-item-icon" :src="item.image" />

          <div v-else class="loyalty-how-it-works__list-item-icon">
            {{ index + 1 }}
          </div>

          <div class="loyalty-how-it-works__list-item-content">
            <div class="loyalty-how-it-works__list-item-title">
              {{ item.title }}
            </div>

            <div class="loyalty-how-it-works__list-item-description">
              {{ item.description }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <button-base type="primary" size="lg" @click="clickButton">
      {{ getContent(loyaltyContent, defaultLocaleLoyaltyContent, 'howItWorks.button') }}
    </button-base>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { ILoyaltyPage } from '~/types';

  const loyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('loyaltyContent'));
  const defaultLocaleLoyaltyContent = ref<Maybe<ILoyaltyPage>>(inject('defaultLocaleLoyaltyContent'));
  const listItems = computed(() => {
    return getContent(loyaltyContent.value, defaultLocaleLoyaltyContent.value, 'howItWorks.items') || [];
  });

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();

  const { getContent } = useProjectMethods();

  const loadingModal = ref(false);
  const clickButton = async (): Promise<void> => {
    if (loadingModal.value) return;

    loadingModal.value = true;
    if (isLoggedIn.value) await openWalletModal('deposit');
    else await openModal('sign-in');
    loadingModal.value = false;
  };
</script>

<style src="~/assets/styles/components/loyalty/how-it-works.scss" lang="scss" />
