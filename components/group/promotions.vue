<template>
  <div v-if="promotionsList.length" class="group-promotions">
    <atomic-icon :id="globalComponentsContent?.promotions?.icon" />

    <h2 class="title">{{ globalComponentsContent?.promotions?.label || '' }}</h2>

    <div class="group-promotions__list">
      <div
        v-for="(promotion, index) in promotionsList"
        :key="index"
        class="group-promotions__item"
        :class="{ hovered: hoverCard === index }"
        @click="clickCard(index)"
      >
        <atomic-picture :src="promotion.image" alt="" />

        <div class="content">
          <div class="title">{{ promotion.title }}</div>
          <div class="sub-title">{{ promotion.description }}</div>

          <div class="actions">
            <button-base
              type="primary"
              size="md"
              @click="isLoggedIn ? openWalletModal('deposit') : openModal('sign-up')"
            >
              {{ promotion.buttonLabel }}
            </button-base>

            <atomic-link class="link-more" :href="promotion.link.url" :target-blank="promotion.link.targetBlank">
              {{ promotion.link.label }}
            </atomic-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { IPromotion } from '~/types';

  const globalStore = useGlobalStore();
  const { globalComponentsContent } = globalStore;

  const profileStore = useProfileStore();
  const { isLoggedIn } = storeToRefs(profileStore);
  const { openModal, openWalletModal } = useModalStore();

  const hoverCard = ref<number | undefined>(undefined);
  const { isMobile } = storeToRefs(globalStore);
  const clickCard = (index: number): void => {
    if (isMobile.value) {
      hoverCard.value = hoverCard.value === index ? undefined : index;
    }
  };

  const clickOutside = (e: any): void => {
    if (e.target.closest('.group-promotions__item')) return;
    hoverCard.value = undefined;
  };

  const promotionsList = computed<IPromotion[]>(() => {
    return globalComponentsContent?.promotions?.items?.length ? globalComponentsContent.promotions.items : [];
  });

  onMounted(() => {
    document.addEventListener('click', clickOutside);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', clickOutside);
  });
</script>

<style src="~/assets/styles/components/group/promotions.scss" lang="scss" />
