<template>
  <div class="content profile-bonuses">
    <div class="header">
      <h1 class="heading">
        {{ getContent(currentLocaleContent, defaultLocaleContent, 'title') }}
      </h1>
    </div>

    <nuxt-link class="link-bonus" :to="localizePath('/profile/history?tab=bonuses')">
      {{ getContent(currentLocaleContent, defaultLocaleContent, 'historyLink') }}
    </nuxt-link>

    <transition name="fade" mode="out-in">
      <div v-if="mounting" class="profile-bonuses__spinner">
        <div class="profile-bonuses__spinner-border">
          <div class="profile-bonuses__spinner-core" />
        </div>
      </div>

      <div v-else class="profile-bonuses__container">
        <template v-if="hasActiveBlock">
          <bonuses-active
            :package-bonuses="activePackageBonuses"
            @remove-bonus="removeBonusHandle"
            @remove-free-spin="removeFreeSpinHandle"
            @open-package-modal="openPackageModal"
          />

          <atomic-divider class="profile-bonuses__blocks-divider" />
        </template>

        <template v-if="hasIssuedBlock">
          <bonuses-issued
            :loading-bonuses="loadingBonuses"
            :package-bonuses="issuedPackageBonuses"
            @remove-bonus="removeBonusHandle"
            @remove-free-spin="removeFreeSpinHandle"
            @activate-bonus="activateBonusHandle"
            @activate-free-spin="activateFreeSpinHandle"
            @open-package-modal="openPackageModal"
          />

          <atomic-divider class="profile-bonuses__blocks-divider" />
        </template>

        <template v-if="depositBonuses.length">
          <bonuses-deposit
            :loading-bonuses="loadingBonuses"
            :package-bonuses="depositPackageBonuses"
            @activate-deposit="activateDepositBonus"
            @open-package-modal="openPackageModal"
          />

          <atomic-divider class="profile-bonuses__blocks-divider" />
        </template>

        <bonuses-promo-code />
      </div>
    </transition>

    <modal-confirm-bonus
      v-bind="modalState"
      :show-modal="showModalConfirmBonus"
      :bonuses-updating="loadingBonuses.includes(modalState.bonusInfo?.id || 'unknown')"
      @close-modal="showModalConfirmBonus = false"
      @confirm="
        () => {
          modalState.action === 'remove' ? removeBonus() : activateBonus();
        }
      "
    />

    <modal-confirm-bonus-unsettled
      v-bind="modalState"
      :show-modal="showConfirmBonusUnsettledModal"
      :bonuses-updating="loadingBonuses.includes(modalState.bonusInfo?.id || 'unknown')"
      @close-modal="showConfirmBonusUnsettledModal = false"
      @confirm="removeBonus"
    />

    <modal-package-bonus
      :show-modal="showPackageModal"
      :bonuses-list="packageModalList"
      :loading-bonuses="loadingBonuses"
      @close="showPackageModal = false"
      @remove-bonus="removeBonusHandle"
      @remove-free-spin="removeFreeSpinHandle"
      @activate-bonus="activateBonusHandle"
      @activate-free-spin="activateFreeSpinHandle"
      @activate-deposit="activateDepositBonus"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import type { IProfileBonuses } from '~/types';
  import type { IBonus, IPlayerBonus, IPlayerFreeSpin } from '@skeleton/core/types';
  import debounce from 'lodash/debounce.js';

  const globalStore = useGlobalStore();
  const bonusStore = useBonusStore();
  const { popupsData, defaultLocalePopupsData, alertsData, defaultLocaleAlertsData } = storeToRefs(globalStore);
  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);
  const { localizePath, getContent, getMinBonusDeposit } = useProjectMethods();
  const { getPlayerBonuses, getPlayerFreeSpins, getDepositBonuses } = bonusStore;
  const {
    activePlayerBonuses,
    activePlayerFreeSpins,
    issuedPlayerBonuses,
    issuedPlayerFreeSpins,
    depositBonuses,
    walletDepositBonus,
    playerBonuses,
    playerFreeSpins,
  } = storeToRefs(bonusStore);
  const { showAlert } = useLayoutStore();
  const { openModal, openWalletModal } = useModalStore();
  const hasActiveBlock = computed(() => activePlayerBonuses.value.length || activePlayerFreeSpins.value.length);
  const hasIssuedBlock = computed(() => {
    const hasSimpleBonus = [...issuedPlayerBonuses.value, ...issuedPlayerFreeSpins.value].some(
      bonus => !bonus.packageId
    );
    return hasSimpleBonus || issuedPackageBonuses.value.length;
  });

  const contentParams = {
    contentKey: 'profileBonusesContent',
    contentRoute: ['profile', 'bonuses'],
    isPage: true,
  };
  const { getContentData } = useContentLogic<IProfileBonuses>(contentParams);
  const { data } = await useLazyAsyncData(getContentData);
  const currentLocaleContent = computed(() => data.value?.currentLocaleData);
  const defaultLocaleContent = computed(() => data.value?.defaultLocaleData);

  provide('bonusesContent', currentLocaleContent);
  provide('defaultLocaleBonusesContent', defaultLocaleContent);

  interface IModalState extends Record<string, any> {
    image?: string;
    title?: string;
    description?: string;
    wageringLabel?: string;
    confirmButton?: string;
    cancelButton?: string;
    bonusInfo?: IPlayerBonus | IPlayerFreeSpin | undefined;
    bonusType?: 'bonus' | 'freeSpin' | undefined;
    action?: 'remove' | 'activate' | undefined;
  }

  const modalState = reactive<IModalState>({});
  const showConfirmBonusUnsettledModal = ref(false);
  const showModalConfirmBonus = ref(false);
  const loadingBonuses = ref<string[]>([]);
  const loadedBonuses = ref<string[]>([]);

  const { activatePlayerBonus, cancelPlayerBonus, activatePlayerFreeSpin, cancelPlayerFreeSpin } = useCoreBonusApi();

  const hasCancelLockBonus = computed(() => {
    const activeBonus = activePlayerBonuses.value[0];
    return !!activeBonus && activeBonus.isBonusCancelLock && activeBonus.currentWagerPercentage > 0;
  });

  const setModalStateForUnsettledBonus = (): void => {
    const data = getContent(popupsData.value, defaultLocalePopupsData?.value, 'cancelBonusUnsettled');
    if (data) {
      modalState.image = data.image;
      modalState.title = data.title;
      modalState.description = data.description;
      modalState.wageringLabel = data.wageringLabel;
      modalState.confirmButton = data.confirmButton;
      modalState.cancelButton = data.cancelButton;
    }
  };

  const setModalStateForCancelBonus = (bonusInfo: IPlayerBonus | IPlayerFreeSpin): void => {
    const data = getContent(popupsData.value, defaultLocalePopupsData.value, 'cancelBonus');
    if (data) {
      modalState.title = data.title;
      modalState.description =
        bonusInfo.currentWagerPercentage > 0 || bonusInfo.progress > 0
          ? data.activeBonusDescription
          : data.issuedBonusDescription;
      modalState.confirmButton = data.confirmButton;
      modalState.cancelButton = data.cancelButton;
    }
  };

  const setModalStateForActiveBonus = (): void => {
    const data = popupsData.value?.changeActiveBonus || defaultLocalePopupsData?.value?.changeActiveBonus;
    if (data) {
      modalState.title = data.title;
      modalState.description = data.description;
      modalState.confirmButton = data.confirmButton;
      modalState.cancelButton = data.cancelButton;
    }
  };

  const removeBonus = async (): Promise<void> => {
    const staticBonusId = modalState.bonusInfo?.id;
    if (!staticBonusId || loadingBonuses.value.includes(staticBonusId)) return;
    loadingBonuses.value.push(staticBonusId);

    try {
      if (modalState.bonusType === 'bonus') await cancelPlayerBonus(staticBonusId);
      else await cancelPlayerFreeSpin(staticBonusId);
    } catch {
      loadingBonuses.value = loadingBonuses.value.filter(id => id !== staticBonusId);
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    loadedBonuses.value.push(staticBonusId);
  };

  const activateBonus = async (): Promise<void> => {
    const staticBonusId = modalState.bonusInfo?.id;
    if (!staticBonusId || loadingBonuses.value.includes(staticBonusId)) return;
    loadingBonuses.value.push(staticBonusId);

    try {
      if (modalState.bonusType === 'bonus') await activatePlayerBonus(staticBonusId);
      else await activatePlayerFreeSpin(staticBonusId);
    } catch {
      loadingBonuses.value = loadingBonuses.value.filter(id => id !== staticBonusId);
      showAlert(alertsData.value?.global?.somethingWrong || defaultLocaleAlertsData.value?.global?.somethingWrong);
    }

    loadedBonuses.value.push(staticBonusId);
  };

  const activateBonusHandle = (bonus: IPlayerBonus): void => {
    if (loadingBonuses.value.includes(bonus.id)) return;
    modalState.bonusInfo = bonus;
    modalState.bonusType = 'bonus';
    modalState.action = 'activate';

    if (hasCancelLockBonus.value) {
      openModal('bonus-cancel-lock');
    } else {
      setModalStateForActiveBonus();
      showModalConfirmBonus.value = true;
    }
  };

  const activateFreeSpinHandle = (freeSpin: IPlayerFreeSpin): void => {
    if (loadingBonuses.value.includes(freeSpin.id)) return;
    modalState.bonusInfo = freeSpin;
    modalState.bonusType = 'freeSpin';
    modalState.action = 'activate';

    activateBonus();
  };

  const removeBonusHandle = (bonus: IPlayerBonus): void => {
    if (loadingBonuses.value.includes(bonus.id)) return;
    modalState.bonusInfo = bonus;
    modalState.bonusType = 'bonus';
    modalState.action = 'remove';

    if (hasCancelLockBonus.value && bonus.status !== 1) {
      openModal('bonus-cancel-lock');
    } else if (bonus.openedTransactionsCount > 0) {
      setModalStateForUnsettledBonus();
      showConfirmBonusUnsettledModal.value = true;
    } else {
      setModalStateForCancelBonus(bonus);
      showModalConfirmBonus.value = true;
    }
  };

  const removeFreeSpinHandle = (freeSpin: IPlayerFreeSpin): void => {
    if (loadingBonuses.value.includes(freeSpin.id)) return;
    modalState.bonusInfo = freeSpin;
    modalState.bonusType = 'freeSpin';
    modalState.action = 'remove';

    setModalStateForCancelBonus(freeSpin);
    showModalConfirmBonus.value = true;
  };

  const activateDepositBonus = async ({
    depositBonus,
    loadingId,
  }: {
    depositBonus: IBonus;
    loadingId?: string;
  }): Promise<void> => {
    if (loadingBonuses.value.includes(loadingId || depositBonus.id)) return;
    loadingBonuses.value.push(loadingId || depositBonus.id);
    const minDeposit = getMinBonusDeposit(depositBonus);
    walletDepositBonus.value = { id: depositBonus.id, packageId: depositBonus.package?.id, amount: minDeposit?.amount };

    await openWalletModal();

    setTimeout(() => {
      loadingBonuses.value = loadingBonuses.value.filter(id => id !== (loadingId || depositBonus.id));
    }, 500);
  };

  const activePackageBonuses = ref<Record<string, any>[][]>([]);
  const issuedPackageBonuses = ref<Record<string, any>[][]>([]);
  const depositPackageBonuses = ref<Record<string, any>[][]>([]);
  const showPackageModal = ref(false);
  const packageModalList = ref<Record<string, any>[]>([]);

  const updatePackageModalList = (): void => {
    if (
      !activePackageBonuses.value.length &&
      !issuedPackageBonuses.value.length &&
      !depositPackageBonuses.value.length
    ) {
      showPackageModal.value = false;
    }

    const packageId =
      packageModalList.value[0]?.issueSessionId ||
      packageModalList.value[0]?.packageId ||
      packageModalList.value[0]?.package?.id;

    const newBonusesList = [
      ...activePackageBonuses.value,
      ...issuedPackageBonuses.value,
      ...depositPackageBonuses.value,
    ].find(bonusesList => {
      return (
        bonusesList[0].issueSessionId === packageId ||
        bonusesList[0].packageId === packageId ||
        bonusesList[0].package?.id === packageId
      );
    });

    if (newBonusesList) packageModalList.value = newBonusesList;
    else showPackageModal.value = false;
  };

  const checkLoadingBonuses = (): void => {
    loadingBonuses.value = loadingBonuses.value.filter(
      loadingId => !loadedBonuses.value.some(loadedId => loadingId === loadedId)
    );
    if (modalState.bonusInfo?.id && loadedBonuses.value.some(loadedId => loadedId === modalState.bonusInfo?.id)) {
      showModalConfirmBonus.value = false;
      showConfirmBonusUnsettledModal.value = false;
    }
    loadedBonuses.value = [];
  };

  const getPlayerPackages = async (
    packageIds: string[]
  ): Promise<{
    playerPackageBonuses: IPlayerBonus[];
    playerPackageFreeSpins: IPlayerFreeSpin[];
  }> => {
    const { getPlayerBonuses, getPlayerFreeSpins } = useCoreBonusApi();
    const [{ data: playerPackageBonuses }, { data: playerPackageFreeSpins }] = await Promise.all([
      getPlayerBonuses({ packageId: packageIds, currency: [activeAccount.value?.currency as string] }),
      getPlayerFreeSpins({ packageId: packageIds, currency: [activeAccount.value?.currency as string] }),
    ]);

    return { playerPackageBonuses, playerPackageFreeSpins };
  };

  const getUniquePackageIds = (): {
    uniquePlayerPackageIds: string[];
    uniquePlayerPackageIssueSessionIds: string[];
    uniqueDepositPackageIds: string[];
  } => {
    const uniquePlayerPackageIds: string[] = [];
    const uniquePlayerPackageIssueSessionIds: string[] = [];
    const uniqueDepositPackageIds: string[] = [];

    [...playerBonuses.value, ...playerFreeSpins.value].forEach(bonus => {
      if (bonus.packageId && !uniquePlayerPackageIds.includes(bonus.packageId)) {
        uniquePlayerPackageIds.push(bonus.packageId);
      }
      if (bonus.packageId && !uniquePlayerPackageIssueSessionIds.includes(bonus.issueSessionId ?? bonus.packageId)) {
        uniquePlayerPackageIssueSessionIds.push(bonus.issueSessionId ?? bonus.packageId);
      }
    });

    depositBonuses.value.forEach(bonus => {
      if (bonus.package?.id && !uniqueDepositPackageIds.includes(bonus.package.id)) {
        uniqueDepositPackageIds.push(bonus.package.id);
      }
    });

    return { uniquePlayerPackageIds, uniquePlayerPackageIssueSessionIds, uniqueDepositPackageIds };
  };

  const getPackageBonuses = async (): Promise<void> => {
    const { uniquePlayerPackageIds, uniquePlayerPackageIssueSessionIds, uniqueDepositPackageIds } =
      getUniquePackageIds();

    if (!uniquePlayerPackageIds.length && !uniqueDepositPackageIds.length) {
      checkLoadingBonuses();
      activePackageBonuses.value = [];
      issuedPackageBonuses.value = [];
      depositPackageBonuses.value = [];
      return;
    }

    try {
      const { playerPackageBonuses, playerPackageFreeSpins } = await getPlayerPackages(uniquePlayerPackageIds);
      const transformPlayerPackageBonuses = playerPackageBonuses.map(bonus => ({ ...bonus, isCash: true }));
      const transformPlayerPackageFreeSpins = playerPackageFreeSpins.map(freeSpin => ({
        ...freeSpin,
        isFreeSpin: true,
      }));
      const transformDepositPackageBonuses = depositBonuses.value.map(bonus => ({ ...bonus, isDeposit: true }));

      const playerPackageList = uniquePlayerPackageIssueSessionIds.map(packageIssueSessionId => {
        return [...transformPlayerPackageBonuses, ...transformPlayerPackageFreeSpins]
          .filter(bonus => (bonus.issueSessionId ?? bonus.packageId) === packageIssueSessionId)
          .sort((prevBonus, nextBonus) => prevBonus.packagePriority - nextBonus.packagePriority);
      });

      depositPackageBonuses.value = uniqueDepositPackageIds.map(packageBonusId => {
        return transformDepositPackageBonuses
          .filter(bonus => bonus.package?.id === packageBonusId)
          .sort((prevBonus, nextBonus) => prevBonus.packagePriority - nextBonus.packagePriority);
      });

      activePackageBonuses.value = playerPackageList.filter(bonusesList =>
        bonusesList.some(bonus => bonus.status === 2)
      );
      issuedPackageBonuses.value = playerPackageList.filter(
        bonusesList => !bonusesList.some(bonus => bonus.status === 2)
      );

      if (showPackageModal.value) updatePackageModalList();
    } catch {
      console.error('Failed to get package bonuses');
    }

    checkLoadingBonuses();
  };

  const openPackageModal = (bonusesList: Record<string, any>[]): void => {
    packageModalList.value = bonusesList;
    showPackageModal.value = true;
  };

  const debouncePackageBonus = debounce(getPackageBonuses, 200, { leading: false });

  const mounting = ref(true);
  watch([playerBonuses, playerFreeSpins, depositBonuses], () => {
    if (!mounting.value) debouncePackageBonus();
  });

  onMounted(async () => {
    await Promise.allSettled([getPlayerBonuses(), getPlayerFreeSpins(), getDepositBonuses()]);
    await getPackageBonuses();
    mounting.value = false;
  });
</script>

<style src="~/assets/styles/pages/profile/bonuses.scss" lang="scss" />
