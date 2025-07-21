<template>
  <vue-final-modal
    class="modal-loyalty-level"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('loyalty-level')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('loyalty-level')" />
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
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'description') }}
      </div>

      <loyalty-level-benefits v-if="levelBenefits.length" class="is-order-active" :levelBenefits="levelBenefits" />

      <button-base type="primary" size="md" @click="clickButton">
        {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'button.label') }}
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['loyaltyLevel']>;
    defaultLocaleData: Maybe<IModalsContent['loyaltyLevel']>;
  }>();

  const { closeModal } = useModalStore();
  const loyaltyStore = useLoyaltyStore();
  const { currentLevelName, loyaltyAccount } = storeToRefs(loyaltyStore);

  const modalTitle = computed(() => {
    const contentTitle = getContent(props.currentLocaleData, props.defaultLocaleData, 'title');
    if (contentTitle) {
      return contentTitle
        .replace('{levelName}', currentLevelName.value)
        .replace('{levelOrder}', loyaltyAccount.value?.currentLevel?.order || '');
    }
    return undefined;
  });

  const levelsBenefitsContentParams = {
    contentKey: 'levels-benefits',
    contentCollection: 'pages',
    contentSource: 'loyalty',
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
    const url = getContent(props.currentLocaleData, props.defaultLocaleData, 'button.link');
    closeModal('loyalty-level');
    if (url) {
      const router = useRouter();
      router.push(localizePath(url));
    }
  };
</script>

<style src="~/assets/styles/components/modal/loyalty-level.scss" lang="scss" />
