<template>
  <vue-final-modal
    v-model="modals.walletBonusDetails"
    class="modal-wallet-bonus-details"
    :clickToClose="false"
    @clickOutside="closeModal('walletBonusDetails')"
    @beforeOpen="setParamsList"
  >
    <div class="modal-wallet-bonus-details__scroll">
      <div class="modal-wallet-bonus-details__header">
        <atomic-image
          v-if="titleImage"
          class="img"
          :src="titleImage"
        />

        <div class="modal-wallet-bonus-details__title">
          {{ getContent(popupsData, defaultLocalePopupsData, 'walletBonusDetails.title') }}
        </div>

        <button-modal-close @close="closeModal('walletBonusDetails')"/>
      </div>

      <dl class="modal-wallet-bonus-details__dl">
        <template v-for="{ label, value } in paramsList">
          <dt>{{ label }}</dt>
          <dd>{{ value === 'games' ? bonusGames : value }}</dd>
        </template>
      </dl>

      <button-base type="ghost" size="xs" @click="goToBonuses">
        <span>
          {{ getContent(popupsData, defaultLocalePopupsData, 'walletBonusDetails.readMore') }}
        </span>

        <atomic-icon id="arrow_next"/>
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { VueFinalModal } from 'vue-final-modal';
  import type { IAmountRangeItem } from "@skeleton/core/types";

  const {
    getContent,
    formatBalance,
    getEquivalentFromBase,
    localizePath,
    getSumFromAmountItems
  } = useProjectMethods();
  const {
    popupsData,
    defaultLocalePopupsData,
    globalComponentsContent,
    defaultLocaleGlobalComponentsContent
  } = useGlobalStore();

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const bonusStore = useBonusStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const layoutStore = useLayoutStore();
  const { modals } = storeToRefs(layoutStore);
  const { closeModal } = layoutStore;

  const gamesStore = useGamesStore();
  const { gameProviders } = storeToRefs(gamesStore);

  const titleImage = computed(() => {
    return getContent(popupsData, defaultLocalePopupsData, 'walletBonusDetails.titleImage')
  })

  interface IParam {
    label: string;
    value: string;
  }

  const paramsLabels = getContent(popupsData, defaultLocalePopupsData, 'walletBonusDetails.infoLabels');
  const paramsList = ref<IParam[]>([]);

  const getCurrentCurrencySumRange = (
    exclusionItems?: IAmountRangeItem[],
    baseAmountFrom?: number|null,
    baseAmountTo?: number|null
  ): string|undefined => {
    let from: string|undefined;
    let to: string|undefined;

    const fromLabel = paramsLabels?.from;
    const toLabel = paramsLabels?.to;
    const exclusionItem = exclusionItems?.find(item => item.currency === activeAccount.value?.currency);

    if (exclusionItem) {
      if (exclusionItem.amountFrom) {
        const { amount, currency } = formatBalance(exclusionItem.currency, exclusionItem.amountFrom);
        from = `${fromLabel} ${amount} ${currency}`;
      }

      if (exclusionItem.amountTo) {
        const { amount, currency } = formatBalance(exclusionItem.currency, exclusionItem.amountTo);
        to = `${toLabel} ${amount} ${currency}`;
      }
    }

    if (!from && baseAmountFrom) {
      const { amount, currency } = getEquivalentFromBase(baseAmountFrom, activeAccount.value?.currency);
      from = `${fromLabel} ${amount} ${currency}`;
    }

    if (!to && baseAmountTo) {
      const { amount, currency } = getEquivalentFromBase(baseAmountTo, activeAccount.value?.currency);
      to = `${toLabel} ${amount} ${currency}`;
    }

    if (from || to) {
      return `${from || ''} ${to || ''}`
    }

    return undefined;
  }

  const getDepositAmount = (): string|undefined => {
    const invoicesItems = depositMoreInfoBonus.value?.triggerConditions?.invoiceAmountItems;
    const invoiceFromBase = depositMoreInfoBonus.value?.triggerConditions?.baseCurrencyInvoiceAmountFrom;
    const invoiceToBase = depositMoreInfoBonus.value?.triggerConditions?.baseCurrencyInvoiceAmountTo;
    return getCurrentCurrencySumRange(invoicesItems, invoiceFromBase, invoiceToBase);
  }

  const getMaxWinAmount = (): string|undefined => {
    const maxWinItems = depositMoreInfoBonus.value?.maxWinAmountItems;
    const maxWinAmountBase = depositMoreInfoBonus.value?.baseCurrencyMaxWinAmount;
    return getSumFromAmountItems(maxWinItems, maxWinAmountBase);
  }

  const getCasinoBetAmount = (): string|undefined => {
    const casinoBetItems = depositMoreInfoBonus.value?.wagerCasinoConditions?.amountItems;
    const casinoFromBase = depositMoreInfoBonus.value?.wagerCasinoConditions?.baseCurrencyAmountFrom;
    const casinoToBase = depositMoreInfoBonus.value?.wagerCasinoConditions?.baseCurrencyAmountTo;
    return getCurrentCurrencySumRange(casinoBetItems, casinoFromBase, casinoToBase);
  }

  const getSportsbookBetAmount = (): string|undefined => {
    const sportsbookBetItems = depositMoreInfoBonus.value?.wagerSportsbookConditions?.amountItems;
    const sportsbookFromBase = depositMoreInfoBonus.value?.wagerSportsbookConditions?.baseCurrencyAmountFrom;
    const sportsbookToBase = depositMoreInfoBonus.value?.wagerSportsbookConditions?.baseCurrencyAmountTo;
    return getCurrentCurrencySumRange(sportsbookBetItems, sportsbookFromBase, sportsbookToBase);
  }

  const getBonusProvider = (): string|undefined => {
    const bonusProviderList = depositMoreInfoBonus.value?.wagerCasinoConditions?.providerIds;
    const providersExcluded = depositMoreInfoBonus.value?.wagerCasinoConditions?.providerIdsExcluded;

    if (bonusProviderList?.length) {
      const providersNames = gameProviders.value
        .filter(provider => bonusProviderList.includes(provider.id))
        .map(provider => provider.name);

      return `${providersExcluded ? paramsLabels?.excluded : ''} ${providersNames.join(', ')}`
    }

    return undefined;
  }

  const getFreeSpinProvider = (): string|undefined => {
    const freeSpinProviderId = depositMoreInfoBonus.value?.assignConditions?.providerId;

    if (freeSpinProviderId) {
      return gameProviders.value.find(provider => provider.id === freeSpinProviderId)?.name;
    }

    return undefined;
  }


  const bonusGames = ref<string|undefined>();
  const getBonusGames = async (gamesList: string[]): Promise<void> => {
    const gamesExcluded = depositMoreInfoBonus.value?.wagerCasinoConditions?.gameIdsExcluded;

    const { getFilteredGames } = useCoreGamesApi();
    try {
      const { data } = await getFilteredGames({ gameId: gamesList });
      const gamesNames = data.map(game => game.name);

      if (depositMoreInfoBonus.value?.type === 3) {
        bonusGames.value = `${gamesNames.join(', ')}`;
      } else {
        bonusGames.value = `${gamesExcluded ? paramsLabels?.excluded : ''} ${gamesNames.join(', ')}`;
      }
    } catch {
      console.error('Something went wrong with games loading!')
    }
  }

  interface IParams { [key: string]: IParam|undefined }

  const setParamsList = async (): Promise<void> => {
    if (!depositMoreInfoBonus.value) return;
    bonusGames.value = undefined;
    const bonusType = depositMoreInfoBonus.value?.type;

    const params:IParams = {
      deposit: undefined,
      type: {
        label: paramsLabels?.bonusType,
        value: getContent(
          globalComponentsContent,
          defaultLocaleGlobalComponentsContent,
          `constants.bonusTypes.${bonusType}`
        )
      },
      freeSpins: undefined,
      casinoWager: undefined,
      sportsbookWager: undefined,
      maxWin: undefined,
      casinoBet: undefined,
      sportsbookBet: undefined,
      providers: undefined,
      games: undefined
    }

    const depositSum = getDepositAmount();
    if (depositSum) params.deposit = { label: paramsLabels?.depositAmount, value: depositSum };

    if (bonusType === 3) {
      const freeSpinsValue = `${depositMoreInfoBonus.value?.assignConditions?.countFreespins} FS`;
      params.freeSpins = { label: paramsLabels?.freeSpins, value: freeSpinsValue };
    }

    if (depositMoreInfoBonus.value?.wagerCasino && bonusType !== 3) {
      params.casinoWager = { label: paramsLabels?.casinoWager, value: `x${depositMoreInfoBonus.value?.wagerCasino}` };
    }

    if (depositMoreInfoBonus.value?.wagerSportsbook && bonusType !== 3) {
      params.sportsbookWager = { label: paramsLabels?.sportsbookWager, value: `x${depositMoreInfoBonus.value?.wagerSportsbook}` };
    }

    const maxWinSum = getMaxWinAmount();
    if (maxWinSum && bonusType !== 3) params.maxWin = { label: paramsLabels?.maxWin, value: maxWinSum };

    const casinoBetSum = getCasinoBetAmount();
    if (casinoBetSum && bonusType !== 3) params.casinoBet = { label: paramsLabels?.casinoBetSum, value: casinoBetSum };

    const sportsbookBetSum = getSportsbookBetAmount();
    if (sportsbookBetSum && bonusType !== 3) params.sportsbookBet = { label: paramsLabels?.sportsbookBetSum, value: sportsbookBetSum };

    if (bonusType === 3) {
      const freeSpinProvider = getFreeSpinProvider();
      if (freeSpinProvider) params.providers = { label: paramsLabels?.providers, value: freeSpinProvider };
    } else {
      const bonusProviders = getBonusProvider();
      if (bonusProviders) params.providers = { label: paramsLabels?.providers, value: bonusProviders };
    }

    const freeSpinGame = depositMoreInfoBonus.value?.assignConditions?.gameId;
    const bonusGamesList = depositMoreInfoBonus.value?.wagerCasinoConditions?.gameIds;
    if (freeSpinGame || bonusGamesList?.length) {
      getBonusGames(freeSpinGame ? [freeSpinGame] : bonusGamesList);
      params.games = { label: paramsLabels?.games, value: 'games' };
    }

    paramsList.value = Object.values(params).filter(value => value) as IParam[];
  }

  const goToBonuses = (): void => {
    closeModal('walletBonusDetails');
    closeModal('wallet');
    const router = useRouter();
    router.push(localizePath('/welcome-package'));
  }
</script>

<style src="~/assets/styles/components/modal/wallet-bonus-details.scss" lang="scss" />

