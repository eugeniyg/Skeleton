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
      :showModal="showModalConfirmBonus"
      :bonusesUpdating="bonusesUpdating"
      @closeModal="showModalConfirmBonus = false"
      @confirm="confirmAction"
    />
    
    <ModalConfirmBonusUnsettled
      v-bind="modalState"
      :showModal="showConfirmBonusUnsettledModal"
      :bonusesUpdating="bonusesUpdating"
      @closeModal="showConfirmBonusUnsettledModal = false"
      @confirm="confirmAction"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IPlayerBonus, IPlayerFreeSpin } from '@skeleton/core/types';
  import type { IProfileBonuses } from '~/types';
  
  const props = defineProps<{
    content?: IProfileBonuses['cashBonuses'] | IProfileBonuses['freeSpins'],
    bonusType: 'bonus' | 'free-spin'
  }>();
  
  interface IModalState extends Record<string, any> {
    image?: string,
    title?: string,
    description?: string,
    wageringLabel?: string,
    confirmButton?: string,
    cancelButton?: string,
    bonusInfo?: IPlayerBonus | IPlayerFreeSpin | undefined,
    mode: 'activate' | 'cancel'
    bonusData?: IPlayerBonus
  }
  
  const modalState = reactive<IModalState>({
    image: undefined,
    title: undefined,
    description: undefined,
    wageringLabel: undefined,
    confirmButton: undefined,
    cancelButton: undefined,
    bonusInfo: undefined,
    mode: 'activate',
  });
  
  const showModalConfirmBonus = ref<boolean>(false);
  const showConfirmBonusUnsettledModal = ref<boolean>(false);
  
  const bonusStore = useBonusStore();
  const {
    activePlayerBonuses,
    activePlayerFreeSpins
  } = storeToRefs(bonusStore);
  const orderedBonuses = computed(() => {
    if (props.bonusType === 'bonus') {
      return activePlayerBonuses.value.reduce((acc: IPlayerBonus[], currentBonus) => {
        return currentBonus.status === 2 ? [currentBonus, ...acc] : [...acc, currentBonus];
      }, []);
    }
    
    return activePlayerFreeSpins.value.reduce((acc: IPlayerFreeSpin[], currentFreeSpin) => {
      return currentFreeSpin.status === 2 ? [currentFreeSpin, ...acc] : [...acc, currentFreeSpin];
    }, []);
  });
  
  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const {
    alertsData,
    defaultLocaleAlertsData,
    popupsData,
    defaultLocalePopupsData,
  } = storeToRefs(globalStore);
  
  const setModalState = (data: any): void => {
    modalState.title = data.title;
    modalState.description = data.description;
    modalState.confirmButton = data.confirmButton;
    modalState.cancelButton = data.cancelButton;
  };
  
  const setModalStateForUnsettledBonus = (): void => {
    const data = popupsData.value?.cancelBonusUnsettled || defaultLocalePopupsData?.value?.cancelBonusUnsettled;
    if (data) {
      modalState.image = data.image;
      modalState.title = data.title;
      modalState.description = data.description;
      modalState.wageringLabel = data.wageringLabel;
      modalState.confirmButton = data.confirmButton;
      modalState.cancelButton = data.cancelButton;
    }
  };
  
  const setModalStateForActiveBonus = (): void => {
    const data = popupsData.value?.changeActiveBonus || defaultLocalePopupsData?.value?.changeActiveBonus;
    if (data) setModalState(data);
  };
  
  const setModalStateForCancelBonus = (processBonus: IPlayerBonus | IPlayerFreeSpin): void => {
    const data = popupsData.value?.cancelBonus || defaultLocalePopupsData?.value?.cancelBonus;
    if (data) {
      modalState.title = data.title;
      modalState.description = processBonus.openedTransactionsCount > 0 ? data.issuedBonusDescription : data.activeBonusDescription;
      modalState.confirmButton = data.confirmButton;
      modalState.cancelButton = data.cancelButton;
    }
  };

  const findCancelLockBonus = (): boolean => {
    return activePlayerBonuses.value.some(bonus => bonus.isBonusCancelLock && (bonus.currentWagerPercentage > 0));
  }

  const emit = defineEmits(['showCancelLock']);
  const changeBonuses = (processBonus: IPlayerBonus | IPlayerFreeSpin, processMode: 'activate' | 'cancel'): void => {
    modalState.bonusInfo = processBonus;
    modalState.mode = processMode;
    const hasCancelLockBonus = findCancelLockBonus();
    
    if (processBonus.status === 1) {
      if (processMode === 'activate') {
        if (hasCancelLockBonus) {
          emit('showCancelLock');
          return;
        }
        setModalStateForActiveBonus();
      } else {
        setModalStateForCancelBonus(processBonus);
      }
      showModalConfirmBonus.value = true;
    } else {
      if (hasCancelLockBonus) {
        emit('showCancelLock');
        return;
      }

      if (processBonus.openedTransactionsCount > 0) {
        setModalStateForUnsettledBonus();
        showConfirmBonusUnsettledModal.value = true;
      } else {
        setModalStateForCancelBonus(processBonus);
        showModalConfirmBonus.value = true;
      }
    }
  };
  
  const bonusesUpdating = ref<boolean>(false);
  const {
    activatePlayerBonus,
    cancelPlayerBonus,
    activatePlayerFreeSpin,
    cancelPlayerFreeSpin
  } = useCoreBonusApi();
  
  const activateBonus = async (): Promise<void> => {
    if (bonusesUpdating.value || !modalState.bonusInfo?.id) return;
    bonusesUpdating.value = true;
    
    try {
      props.bonusType === 'bonus'
        ? await activatePlayerBonus(modalState.bonusInfo.id)
        : await activatePlayerFreeSpin(modalState.bonusInfo.id);
      
      showModalConfirmBonus.value = false;
      showConfirmBonusUnsettledModal.value = false;
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }
    
    bonusesUpdating.value = false;
  };
  
  const cancelBonus = async (): Promise<void> => {
    if (bonusesUpdating.value || !modalState.bonusInfo?.id) return;
    bonusesUpdating.value = true;
    
    try {
      props.bonusType === 'bonus'
        ? await cancelPlayerBonus(modalState.bonusInfo.id)
        : await cancelPlayerFreeSpin(modalState.bonusInfo.id);
      
      showModalConfirmBonus.value = false;
      showConfirmBonusUnsettledModal.value = false;
    } catch {
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }
    
    bonusesUpdating.value = false;
  };
  
  const confirmAction = (): void => {
    if (modalState.bonusInfo?.status === 1 && modalState.mode === 'activate') {
      activateBonus();
    } else {
      cancelBonus();
    }
  };
</script>

<style src="~/assets/styles/components/bonus/active.scss" lang="scss" />
