<template>
  <vue-final-modal
    v-model="modals.loyaltyLevel"
    class="modal-loyalty-level"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 250 }"
    :contentTransition="{ mode: 'in-out', duration: 250 }"
    @clickOutside="closeModal('loyaltyLevel')"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('loyaltyLevel')"/>
      </div>

      <div v-if="modalTitle" class="modal-loyalty-level__title">{{ modalTitle }}</div>

      <div class="modal-loyalty-level__images">
        <atomic-image class="modal-loyalty-level__images-back-bg" src="/img/loyalty/loyalty-univerce.png" />

        <div class="modal-loyalty-level__avatar-wrap">
          <div class="modal-loyalty-level__avatar-container">
            <loyalty-avatar size="lg" />
          </div>
        </div>
      </div>

      <div class="modal-loyalty-level__points">
        <div class="modal-loyalty-level__points-value">
          {{ loyaltyAccount?.currentLevel?.points }}<template v-if="loyaltyAccount?.nextLevel?.points"> - {{ loyaltyAccount.nextLevel.points }}</template>
        </div>

        <div class="modal-loyalty-level__points-label">
          {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.pointsLabel') }}
        </div>
      </div>


      <button-base type="primary" size="lg" @click="closeModal('loyaltyLevel')">
        {{ getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.buttonLabel') }}
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
  const { getContent } = useProjectMethods();
  const loyaltyStore = useLoyaltyStore();
  const { currentLevelName, loyaltyAccount } = storeToRefs(loyaltyStore);

  const modalTitle = computed(() => {
    const contentTitle = getContent(popupsData, defaultLocalePopupsData, 'loyaltyLevel.title');
    if (contentTitle) return contentTitle.replace('{levelName}', currentLevelName.value);
    return undefined;
  })
</script>

<style src="~/assets/styles/components/modal/loyalty-level.scss" lang="scss" />