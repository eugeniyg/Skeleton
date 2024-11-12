<template>
  <vue-final-modal
    v-model="modals.loyaltyLevel"
    class="modal-loyalty-level"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('loyaltyLevel')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('loyaltyLevel')" />
      </div>

      <div class="modal-loyalty-level__images">
        <atomic-image class="modal-loyalty-level__images-back-bg" src="/img/loyalty/loyalty-univerce.png" />

        <div class="modal-loyalty-level__avatar-wrap">
          <div class="modal-loyalty-level__avatar-container">
            <loyalty-avatar size="lg" />
          </div>
        </div>
      </div>

      <div v-if="modalTitle" class="modal-loyalty-level__title">{{ modalTitle }}</div>

      <div class="modal-loyalty-level__description">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.description') }}
      </div>

      <loyalty-level-benefits v-if="levelBenefits.length" class="is-order-active" :levelBenefits="levelBenefits" />

      <button-base type="primary" size="md" @click="clickButton">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.button.label') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
  const { popupsData, defaultLocalePopupsData } = useGlobalStore();
  const { getContent, localizePath } = useProjectMethods();
  const loyaltyStore = useLoyaltyStore();
  const { currentLevelName, loyaltyAccount } = storeToRefs(loyaltyStore);

  const modalTitle = computed(() => {
    const contentTitle = getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.title');
    if (contentTitle) {
      return contentTitle
        .replace('{levelName}', currentLevelName.value)
        .replace('{levelOrder}', loyaltyAccount.value?.currentLevel?.order || '');
    }
    return undefined;
  });

  const levelsBenefitsContentParams = {
    contentKey: 'levels-benefits',
    contentRoute: ['pages', 'loyalty'],
    only: ['rewards'],
  };
  const { getContentData: getLevelsBenefitsContentData } = useContentLogic(levelsBenefitsContentParams);
  const { data: levelsBenefitsContent } = await useLazyAsyncData(getLevelsBenefitsContentData);

  const levelBenefits = computed(() => {
    const contentBenefits = getContent(
      levelsBenefitsContent.value?.currentLocaleData,
      levelsBenefitsContent.value?.defaultLocaleData,
      'rewards.benefits'
    );

    if (!contentBenefits?.length) return [];
    return contentBenefits.map((benefit: { label: string; levels?: string[] }) => ({
      label: benefit.label,
      checked: benefit.levels?.includes(String(loyaltyAccount.value?.currentLevel?.order)),
    }));
  });

  const clickButton = (): void => {
    const url = getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.button.link');
    closeModal('loyaltyLevel');
    if (url) {
      const router = useRouter();
      router.push(localizePath(url));
    }
  };
</script>

<style src="~/assets/styles/components/modal/loyalty-level.scss" lang="scss" />
