<template>
  <vue-final-modal
    v-model="modals.walletBonusDetails"
    class="modal-bonus-details"
    :clickToClose="false"
    :overlayTransition="{ mode: 'in-out', duration: 200 }"
    :contentTransition="{ mode: 'in-out', duration: 200 }"
    @clickOutside="closeModal('walletBonusDetails')"
  >
    <div class="scroll">
      <div class="header">
        <div
          class="header__title"
          :class="{ 'header__title--large': !depositMoreInfoBonus?.bonusValue }"
        >
          {{ depositMoreInfoBonus?.name }}
        </div>

        <div v-if="depositMoreInfoBonus?.bonusValue" class="header__value">
          {{ depositMoreInfoBonus.bonusValue }}
        </div>

        <div class="header__row">
          <bonuses-badge-type
            :mode="depositMoreInfoBonus?.badgeType"
            :contentTypes="getContent(bonusesContent, defaultLocaleBonusesContent, `types`)"
          />

          <bonuses-timer
            v-if="depositMoreInfoBonus?.expiredDate"
            :expiredAt="depositMoreInfoBonus.expiredDate"
            hideLabels
            :timerContent="getContent(bonusesContent, defaultLocaleBonusesContent, 'timer')"
          />

          <bonuses-badge-status
            :status="depositMoreInfoBonus?.badgeStatus"
            :title="badgeStatusLabel"
            :subtitle="getContent(bonusesContent, defaultLocaleBonusesContent, `statuses.nextDeposit`)"
          />
        </div>

        <button-modal-close @close="closeModal('walletBonusDetails')"/>
      </div>

      <div v-if="depositMoreInfoBonus" class="modal-bonus-details__table">
        <bonuses-info-table
          :key="depositMoreInfoBonus.id"
          class="modal-bonus-details__dl"
          :bonusInfo="depositMoreInfoBonus"
        />
      </div>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import type {IProfileBonuses} from "~/types";

  const { getContent, getLocalesContentData } = useProjectMethods();

  const {
    currentLocale,
    defaultLocale
  } = useGlobalStore();

  const bonusStore = useBonusStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const badgeStatusLabel = computed<string|undefined>(() => {
    const contentKey = depositMoreInfoBonus.value?.badgeStatus.includes('available') ? 'available' : 'active';
    return getContent(bonusesContent.value, defaultLocaleBonusesContent.value, `statuses.${contentKey}`);
  })

  const bonusesContent = ref<Maybe<IProfileBonuses>>();
  const defaultLocaleBonusesContent = ref<Maybe<IProfileBonuses>>();

  interface IPageContent {
    currentLocaleData: Maybe<IProfileBonuses>;
    defaultLocaleData: Maybe<IProfileBonuses>;
  }

  const setContentData = (contentData: Maybe<IPageContent>): void => {
    bonusesContent.value = contentData?.currentLocaleData;
    defaultLocaleBonusesContent.value = contentData?.defaultLocaleData;
  }

  const getPageContent = async (): Promise<IPageContent> => {
    const { data } = useNuxtData('profileBonusesContent');
    if (data.value) return data.value;

    const [currentLocaleContentResponse, defaultLocaleContentResponse] = await Promise.allSettled([
      queryContent(currentLocale?.code as string, 'profile', 'bonuses').findOne(),
      currentLocale?.isDefault ? Promise.reject('Current locale is default locale!')
      : queryContent(defaultLocale?.code as string, 'profile', 'bonuses').findOne()
    ]);
    return getLocalesContentData(currentLocaleContentResponse, defaultLocaleContentResponse);
  }

  const { data: content } = await useLazyAsyncData('profileBonusesContent', () => getPageContent());

  watch(content, () => {
    if (content.value) setContentData(content.value);
  }, { immediate: true });

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;
</script>

<style src="~/assets/styles/components/modal/bonus-details.scss" lang="scss" />

