<template>
  <vue-final-modal
    class="modal-restricted-bets"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @before-open="getPlayerBonuses"
  >
    <div class="scroll">
      <div class="header">
        <button-modal-close @close="closeModal('restricted-bets')" />
      </div>

      <atomic-image class="img" :src="getContent(props.currentLocaleData, props.defaultLocaleData, 'image')" />

      <div class="title">
        <template v-if="currentPage === 'betting'">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'sportsbookTitle') }}
        </template>

        <template v-else>{{ getContent(props.currentLocaleData, props.defaultLocaleData, 'casinoTitle') }}</template>
      </div>

      <p class="text">
        <template v-if="currentPage === 'betting'">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'sportsbookDescription') }}
        </template>

        <template v-else>
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'casinoDescription') }}
        </template>
      </p>

      <atomic-bonus-progress
        v-if="activePlayerBonuses[0]"
        :wagering-label="getContent(props.currentLocaleData, props.defaultLocaleData, 'wageringLabel')"
        :bonus-info="activePlayerBonuses[0]"
      />

      <div class="actions">
        <button-base type="primary" size="md" @click="handleConfirm">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'confirmButton') }}
        </button-base>

        <button-base type="ghost" size="xs" @click="handleCancel">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'cancelButton') }}
        </button-base>
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['restrictedBets']>;
    defaultLocaleData: Maybe<IModalsContent['restrictedBets']>;
  }>();

  const { localizePath, getContent } = useProjectMethods();
  const router = useRouter();
  const route = useRoute();
  const currentPage = route.name === 'betting' || route.name === 'locale-betting' ? 'betting' : 'casino';
  const { closeModal } = useModalStore();

  const bonusStore = useBonusStore();
  const { getPlayerBonuses } = bonusStore;
  const { activePlayerBonuses } = storeToRefs(bonusStore);

  watch(activePlayerBonuses, newValue => {
    if (!newValue) closeModal('restricted-bets');
  });

  const handleConfirm = async (): Promise<void> => {
    await router.push(localizePath(currentPage === 'betting' ? '/main' : '/betting'));
    await closeModal('restricted-bets');
  };

  const handleCancel = async (): Promise<void> => {
    await router.push(localizePath('/profile/bonuses'));
    await closeModal('restricted-bets');
  };
</script>

<style src="~/assets/styles/components/modal/restricted-bets.scss" lang="scss" />
