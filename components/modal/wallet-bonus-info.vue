<template>
  <vue-final-modal
    class="modal-wallet-bonus-info"
    :click-to-close="false"
    :overlay-transition="{ mode: 'in-out', duration: 250 }"
    :content-transition="{ mode: 'in-out', duration: 250 }"
    @click-outside="closeModal('wallet-bonus-info')"
    @before-open="setTableData"
  >
    <div class="modal-wallet-bonus-info__scroll">
      <div class="modal-wallet-bonus-info__header">
        <atomic-image v-if="titleImage" class="img" :src="titleImage" />

        <div class="modal-wallet-bonus-info__title">
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'title') }}
        </div>

        <button-modal-close @close="closeModal('wallet-bonus-info')" />
      </div>

      <div v-for="table in bonusesTables" :key="table.id" class="modal-wallet-bonus-info__table">
        <div v-if="bonusesTables.length > 1" class="modal-wallet-bonus-info__table-title">
          {{ table.name }}
        </div>

        <dl class="modal-wallet-bonus-info__dl">
          <template v-for="({ label, value }, index) in table.params" :key="index">
            <dt>{{ label }}</dt>
            <dd>{{ value === 'games' ? bonusGames[table.id] : value }}</dd>
          </template>
        </dl>
      </div>

      <button-base type="ghost" size="xs" @click="goToBonuses">
        <span>
          {{ getContent(props.currentLocaleData, props.defaultLocaleData, 'readMore') }}
        </span>

        <atomic-icon id="arrow-next" />
      </button-base>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
  import { VueFinalModal } from 'vue-final-modal';
  import type { IAmountRangeItem, IBonus } from '@skeleton/api/types';
  import type { IModalsContent } from '~/types';
  import { getFilteredGames } from '@skeleton/api/games';
  import { formatBalance, getEquivalentFromBase, getSumFromAmountItems } from '@skeleton/helpers/amountMethods';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['walletBonusInfo']>;
    defaultLocaleData: Maybe<IModalsContent['walletBonusInfo']>;
  }>();

  const { globalComponentsContent, defaultLocaleGlobalComponentsContent } = useGlobalStore();

  const walletStore = useWalletStore();
  const { activeAccount } = storeToRefs(walletStore);

  const bonusStore = useBonusStore();
  const { depositMoreInfoBonus } = storeToRefs(bonusStore);

  const { closeModal, closeAllModals } = useModalStore();
  const { gameProviders } = useGamesStore();

  const titleImage = computed(() => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, 'titleImage');
  });

  interface IParam {
    label: string;
    value: string;
  }

  const paramsLabels = getContent(props.currentLocaleData, props.defaultLocaleData, 'infoLabels');
  const bonusesTables = ref<{ id: string; name: string; params: IParam[] }[]>([]);

  const getCurrentCurrencySumRange = (
    exclusionItems?: IAmountRangeItem[],
    baseAmountFrom?: number | null,
    baseAmountTo?: number | null
  ): string | undefined => {
    let from: string | undefined;
    let to: string | undefined;

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
      return `${from || ''} ${to || ''}`;
    }

    return undefined;
  };

  const getDepositAmount = (bonusInfo: IBonus): string | undefined => {
    const invoicesItems = bonusInfo.triggerConditions?.invoiceAmountItems;
    const invoiceFromBase = bonusInfo.triggerConditions?.baseCurrencyInvoiceAmountFrom;
    const invoiceToBase = bonusInfo.triggerConditions?.baseCurrencyInvoiceAmountTo;
    return getCurrentCurrencySumRange(invoicesItems, invoiceFromBase, invoiceToBase);
  };

  const getMaxWinAmount = (bonusInfo: IBonus): string | undefined => {
    const maxWinItems = bonusInfo.maxWinAmountItems;
    const maxWinAmountBase = bonusInfo.baseCurrencyMaxWinAmount;
    return getSumFromAmountItems(maxWinItems, maxWinAmountBase);
  };

  const getCasinoBetAmount = (bonusInfo: IBonus): string | undefined => {
    const casinoBetItems = bonusInfo.wagerCasinoConditions?.amountItems;
    const casinoFromBase = bonusInfo.wagerCasinoConditions?.baseCurrencyAmountFrom;
    const casinoToBase = bonusInfo.wagerCasinoConditions?.baseCurrencyAmountTo;
    return getCurrentCurrencySumRange(casinoBetItems, casinoFromBase, casinoToBase);
  };

  const getSportsbookBetAmount = (bonusInfo: IBonus): string | undefined => {
    const sportsbookBetItems = bonusInfo.wagerSportsbookConditions?.amountItems;
    const sportsbookFromBase = bonusInfo.wagerSportsbookConditions?.baseCurrencyAmountFrom;
    const sportsbookToBase = bonusInfo.wagerSportsbookConditions?.baseCurrencyAmountTo;
    return getCurrentCurrencySumRange(sportsbookBetItems, sportsbookFromBase, sportsbookToBase);
  };

  const getBonusProvider = (bonusInfo: IBonus): string | undefined => {
    const bonusProviderList = bonusInfo.wagerCasinoConditions?.providerIds;
    const providersExcluded = bonusInfo.wagerCasinoConditions?.providerIdsExcluded;

    if (bonusProviderList?.length) {
      const providersNames = gameProviders
        .filter(provider => bonusProviderList.includes(provider.id))
        .map(provider => provider.name);

      return `${providersExcluded ? paramsLabels?.excluded : ''} ${providersNames.join(', ')}`;
    }

    return undefined;
  };

  const getFreeSpinProvider = (bonusInfo: IBonus): string | undefined => {
    const freeSpinProviderId = bonusInfo.assignConditions?.providerId;

    if (freeSpinProviderId) {
      return gameProviders.find(provider => provider.id === freeSpinProviderId)?.name;
    }

    return undefined;
  };

  const bonusGames = reactive<{ [key: string]: string }>({});
  const getBonusGames = async (gamesList: string[], bonusInfo: IBonus): Promise<void> => {
    const gamesExcluded = bonusInfo.wagerCasinoConditions?.gameIdsExcluded;

    try {
      const { data } = await getFilteredGames({ gameId: gamesList });
      const gamesNames = data.map(game => game.name);

      if (bonusInfo.type === 3) {
        bonusGames[bonusInfo.id] = `${gamesNames.join(', ')}`;
      } else {
        bonusGames[bonusInfo.id] = `${gamesExcluded ? paramsLabels?.excluded : ''} ${gamesNames.join(', ')}`;
      }
    } catch {
      console.error('Something went wrong with games loading!');
    }
  };

  interface IParams {
    [key: string]: IParam | undefined;
  }

  const getBonusParams = (bonusInfo: IBonus): IParam[] => {
    const bonusType = bonusInfo.type;

    const params: IParams = {
      deposit: undefined,
      type: {
        label: paramsLabels?.bonusType,
        value: getContent(
          globalComponentsContent,
          defaultLocaleGlobalComponentsContent,
          `constants.bonusTypes.${bonusType}`
        ),
      },
      freeSpins: undefined,
      casinoWager: undefined,
      sportsbookWager: undefined,
      maxWin: undefined,
      casinoBet: undefined,
      sportsbookBet: undefined,
      providers: undefined,
      games: undefined,
    };

    const depositSum = getDepositAmount(bonusInfo);
    if (depositSum) params.deposit = { label: paramsLabels?.depositAmount, value: depositSum };

    if (bonusType === 3) {
      const freeSpinsValue = `${bonusInfo.assignConditions?.presets?.[0].quantity} FS`;
      params.freeSpins = { label: paramsLabels?.freeSpins, value: freeSpinsValue };
    }

    if (bonusInfo.wagerCasino && bonusType !== 3) {
      params.casinoWager = { label: paramsLabels?.casinoWager, value: `x${bonusInfo.wagerCasino}` };
    }

    if (bonusInfo.wagerSportsbook && bonusType !== 3) {
      params.sportsbookWager = { label: paramsLabels?.sportsbookWager, value: `x${bonusInfo.wagerSportsbook}` };
    }

    const maxWinSum = getMaxWinAmount(bonusInfo);
    if (maxWinSum && bonusType !== 3) params.maxWin = { label: paramsLabels?.maxWin, value: maxWinSum };

    const casinoBetSum = getCasinoBetAmount(bonusInfo);
    if (casinoBetSum && bonusType !== 3) params.casinoBet = { label: paramsLabels?.casinoBetSum, value: casinoBetSum };

    const sportsbookBetSum = getSportsbookBetAmount(bonusInfo);
    if (sportsbookBetSum && bonusType !== 3)
      params.sportsbookBet = { label: paramsLabels?.sportsbookBetSum, value: sportsbookBetSum };

    if (bonusType === 3) {
      const freeSpinProvider = getFreeSpinProvider(bonusInfo);
      if (freeSpinProvider) params.providers = { label: paramsLabels?.providers, value: freeSpinProvider };
    } else {
      const bonusProviders = getBonusProvider(bonusInfo);
      if (bonusProviders) params.providers = { label: paramsLabels?.providers, value: bonusProviders };
    }

    const freeSpinGame = bonusInfo.assignConditions?.gameId;
    const bonusGamesList = bonusInfo.wagerCasinoConditions?.gameIds;
    if (freeSpinGame || bonusGamesList?.length) {
      getBonusGames(freeSpinGame ? [freeSpinGame] : bonusGamesList, bonusInfo);
      params.games = { label: paramsLabels?.games, value: 'games' };
    }

    return Object.values(params).filter(value => value) as IParam[];
  };

  const setTableData = (): void => {
    Object.keys(bonusGames).forEach(key => {
      delete bonusGames[key];
    });

    if (depositMoreInfoBonus.value?.packageItems?.length) {
      bonusesTables.value = depositMoreInfoBonus.value.packageItems.map(bonusInfo => ({
        id: bonusInfo.id,
        name: bonusInfo.name,
        params: getBonusParams(bonusInfo),
      }));
    } else if (depositMoreInfoBonus.value) {
      bonusesTables.value = [
        {
          id: depositMoreInfoBonus.value.id,
          name: depositMoreInfoBonus.value.name,
          params: getBonusParams(depositMoreInfoBonus.value),
        },
      ];
    }
  };

  const router = useRouter();
  const goToBonuses = async (): Promise<void> => {
    await closeAllModals();
    await router.push(localizePath('/welcome-package'));
  };
</script>

<style src="~/assets/styles/components/modal/wallet-bonus-info.scss" lang="scss" />
