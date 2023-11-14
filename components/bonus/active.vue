<template>
  <div class="bonus-active" data-tooltip-parent>
    <h4 class="bonus-active__title">{{ props.content?.title }}</h4>

    <div class="bonus-active__list">
      <transition-group name="card">
        <CardBonuses
          v-for="bonus in orderedBonuses"
          :key="bonus.id"
          :bonus="bonus"
          :mode="props.bonusType"
          :content="props.content"
          @switchBonus="changeBonuses(bonus, 'activate')"
          @removeBonus="changeBonuses(bonus, 'cancel')"
        />
      </transition-group>
    </div>

    <ModalConfirmBonus
      v-bind="modalState"
      :showModal="showModal"
      :bonusesUpdating="bonusesUpdating"
      @closeModal="showModal = false"
      @confirm="confirmAction"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPlayerBonus, IPlayerFreeSpin } from "@skeleton/core/types";
  import type { IProfileBonuses } from '~/types';

  const props = defineProps<{
    content?: IProfileBonuses['cashBonuses']|IProfileBonuses['freeSpins'],
    bonusType: 'bonus'|'free-spin'
  }>();

  interface IModalState extends Record<string, any>{
    title?: string,
    description?: string,
    confirmButton?: string,
    cancelButton?: string,
    bonusInfo: IPlayerBonus|IPlayerFreeSpin|undefined,
    mode: 'activate'|'cancel'
  }

  const modalState = reactive<IModalState>({
    title: undefined,
    description: undefined,
    confirmButton: undefined,
    cancelButton: undefined,
    bonusInfo: undefined,
    mode: 'activate',
  });

  const showModal = ref<boolean>(false);
  const bonusStore = useBonusStore();
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);
  const orderedBonuses = computed(() => {
    if (props.bonusType === 'bonus') {
      return activePlayerBonuses.value.reduce((acc: IPlayerBonus[], currentBonus) => {
        return currentBonus.status === 2 ? [currentBonus, ...acc] : [...acc, currentBonus];
      }, [])
    }

    return activePlayerFreeSpins.value.reduce((acc: IPlayerFreeSpin[], currentFreeSpin) => {
      return currentFreeSpin.status === 2 ? [currentFreeSpin, ...acc] : [...acc, currentFreeSpin];
    }, [])
  });

  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const {
    alertsData,
    defaultLocaleAlertsData,
    popupsData,
    defaultLocalePopupsData,
  } = storeToRefs(globalStore);

  const changeBonuses = (processBonus: IPlayerBonus, processMode: 'activate'|'cancel'):void => {
    modalState.bonusInfo = processBonus;
    modalState.mode = processMode;

    if (processBonus.status === 1) {
      if (processMode === 'activate') {
        modalState.title = popupsData.value?.changeActiveBonus.title || defaultLocalePopupsData?.value?.changeActiveBonus.title;
        modalState.description = popupsData.value?.changeActiveBonus.description || defaultLocalePopupsData?.value?.changeActiveBonus.description;
        modalState.confirmButton = popupsData.value?.changeActiveBonus.confirmButton || defaultLocalePopupsData?.value?.changeActiveBonus.confirmButton;
        modalState.cancelButton = popupsData.value?.changeActiveBonus.cancelButton || defaultLocalePopupsData?.value?.changeActiveBonus.cancelButton;
      } else {
        modalState.title = popupsData.value?.cancelBonus.title || defaultLocalePopupsData?.value?.cancelBonus.title;
        modalState.description = popupsData.value?.cancelBonus.issuedBonusDescription || defaultLocalePopupsData?.value?.cancelBonus.issuedBonusDescription;
        modalState.confirmButton = popupsData.value?.cancelBonus.confirmButton || defaultLocalePopupsData?.value?.cancelBonus.confirmButton;
        modalState.cancelButton = popupsData.value?.cancelBonus.cancelButton || defaultLocalePopupsData?.value?.cancelBonus.cancelButton;
      }
    } else {
      modalState.title = popupsData.value?.cancelBonus.title || defaultLocalePopupsData?.value?.cancelBonus.title;
      modalState.description = popupsData.value?.cancelBonus.activeBonusDescription || defaultLocalePopupsData?.value?.cancelBonus.activeBonusDescription;
      modalState.confirmButton = popupsData.value?.cancelBonus.confirmButton || defaultLocalePopupsData?.value?.cancelBonus.confirmButton;
      modalState.cancelButton = popupsData.value?.cancelBonus.cancelButton || defaultLocalePopupsData?.value?.cancelBonus.cancelButton;
    }

    showModal.value = true;
  };

  const bonusesUpdating = ref<boolean>(false);
  const {
    activatePlayerBonus,
    cancelPlayerBonus,
    activatePlayerFreeSpin,
    cancelPlayerFreeSpin
  } = useCoreBonusApi();
  const activateBonus = async ():Promise<void> => {
    if (bonusesUpdating.value || !modalState.bonusInfo?.id) return;
    bonusesUpdating.value = true;

    try {
      props.bonusType === 'bonus'
        ? await activatePlayerBonus(modalState.bonusInfo.id)
        : await activatePlayerFreeSpin(modalState.bonusInfo.id);

      showModal.value = false;
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    bonusesUpdating.value = false;
  };

  const cancelBonus = async ():Promise<void> => {
    if (bonusesUpdating.value || !modalState.bonusInfo?.id) return;
    bonusesUpdating.value = true;

    try {
      props.bonusType === 'bonus'
        ? await cancelPlayerBonus(modalState.bonusInfo.id)
        : await cancelPlayerFreeSpin(modalState.bonusInfo.id);

      showModal.value = false;
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    bonusesUpdating.value = false;
  };

  const confirmAction = ():void => {
    if (modalState.bonusInfo?.status === 1 && modalState.mode === 'activate') activateBonus();
    else cancelBonus();
  };
</script>

<style src="~/assets/styles/components/bonus/active.scss" lang="scss" />
