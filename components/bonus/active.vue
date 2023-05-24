<template>
  <div class="bonus-active" data-tooltip-parent>
    <h4 class="bonus-active__title">{{ props.content?.title }}</h4>

    <div v-if="activePlayerCashBonuses.length" class="bonus-active__list">
      <transition-group name="card">
        <CardBonuses
          v-for="bonus in orderedBonuses"
          :key="bonus.id"
          :bonus="bonus"
          mode="bonus"
          :content="props.content"
          @switchBonus="changeBonuses(bonus, 'activate')"
          @removeBonus="changeBonuses(bonus, 'cancel')"
        />
      </transition-group>
    </div>

    <AtomicEmpty
      v-else
      variant="bonuses"
      :title="props.content?.empty.title"
      :subTitle="props.content?.empty.description"
    />

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
  import { PlayerBonusInterface } from '@platform/frontend-core/dist/module';
  import { CashBonusesInterface } from '~/types';

  const props = defineProps<{
    content?: CashBonusesInterface
  }>();

  interface ModalStateInterface extends Record<string, any>{
    title?: string,
    description?: string,
    confirmButton?: string,
    cancelButton?: string,
    bonusInfo: PlayerBonusInterface|undefined,
    mode: 'activate'|'cancel'
  }

  const modalState = reactive<ModalStateInterface>({
    title: undefined,
    description: undefined,
    confirmButton: undefined,
    cancelButton: undefined,
    bonusInfo: undefined,
    mode: 'activate',
  });

  const showModal = ref<boolean>(false);
  const bonusStore = useBonusStore();
  const { activePlayerCashBonuses } = storeToRefs(bonusStore);
  const orderedBonuses = computed(() => (activePlayerCashBonuses.value.reduce((acc: PlayerBonusInterface[], currentBonus) => (currentBonus.status === 2 ? [currentBonus, ...acc] : [...acc, currentBonus]), [])));

  const { showAlert } = useLayoutStore();
  const globalStore = useGlobalStore();
  const {
    alertsData,
    defaultLocaleAlertsData,
    popupsData,
    defaultLocalePopupsData,
  } = storeToRefs(globalStore);

  const changeBonuses = (processBonus: PlayerBonusInterface, processMode: 'activate'|'cancel'):void => {
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
  const { activatePlayerBonus, cancelPlayerBonus } = useCoreBonusApi();
  const activateBonus = async ():Promise<void> => {
    if (bonusesUpdating.value || !modalState.bonusInfo?.id) return;
    bonusesUpdating.value = true;

    try {
      await activatePlayerBonus(modalState.bonusInfo.id);
      showModal.value = false;
    } catch {
      showAlert(alertsData.value?.somethingWrong || defaultLocaleAlertsData.value?.somethingWrong);
    }

    bonusesUpdating.value = false;
  };

  const cancelBonus = async ():Promise<void> => {
    if (bonusesUpdating.value || !modalState.bonusInfo?.id) return;
    bonusesUpdating.value = true;

    try {
      await cancelPlayerBonus(modalState.bonusInfo.id);
      showModal.value = false;
    } catch {
      showAlert(alertsData.value?.somethingWrong || defaultLocaleAlertsData.value?.somethingWrong);
    }

    bonusesUpdating.value = false;
  };

  const confirmAction = ():void => {
    if (modalState.bonusInfo?.status === 1 && modalState.mode === 'activate') activateBonus();
    else cancelBonus();
  };
</script>

<style lang="scss">
.bonus-active {
  margin-top: 16px;

  &__title {
    @include font($heading-5);
    color: var(--white);
    margin: 0 0 rem(24px);
  }

  &__list {
    display: grid;
    grid-gap: 16px;

    @include media(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include media(xl) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include media(xl) {
      grid-template-columns: repeat(3, 1fr);
    }

    @include media(xxxl) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>
