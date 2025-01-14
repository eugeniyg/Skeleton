<template>
  <dl>
    <template v-for="param in tableParams" :key="param.id">
      <template v-if="param.value ?? false">
        <dt>{{ param.label || param.id }}</dt>
        <dd>{{ param.value }}</dd>
      </template>
    </template>
  </dl>
</template>

<script setup lang="ts">
  import type { IModalsContent } from '~/types';

  const props = defineProps<{
    currentLocaleData: Maybe<IModalsContent['bonusDetails']>;
    defaultLocaleData: Maybe<IModalsContent['bonusDetails']>;
    bonusInfo: Record<string, any>;
  }>();

  interface IParam {
    value?: any;
    id?: string;
    label?: string;
  }

  interface ICashParams extends Record<string, IParam> {
    minDeposit: IParam;
    maxDeposit: IParam;
    casinoWager: IParam;
    casinoMinBet: IParam;
    casinoMaxBet: IParam;
    sportsBookWager: IParam;
    sportsBookMinBet: IParam;
    sportsBookMaxBet: IParam;
    maxWin: IParam;
    sticky: IParam;
    cashable: IParam;
  }

  interface IPercentParams extends Record<string, IParam> {
    depositPercentage: IParam;
    maxBonusAmount: IParam;
  }

  interface IFreeSpinParams extends Record<string, IParam> {
    game: IParam;
    provider: IParam;
  }

  const walletStore = useWalletStore();
  const { activeAccount, activeAccountType } = storeToRefs(walletStore);
  const { formatBalance, getEquivalentFromBase, getContent, getSumFromAmountItems } = useProjectMethods();
  const { getProviderList } = useGamesStore();

  const getParamLabel = (paramName: string): string | undefined => {
    return getContent(props.currentLocaleData, props.defaultLocaleData, `paramLabels.${paramName}`);
  };

  const getDeposit = (limit: 'From' | 'To'): string | undefined => {
    const invoicesItems = props.bonusInfo.triggerConditions?.invoiceAmountItems;
    const invoiceBase = props.bonusInfo.triggerConditions?.[`baseCurrencyInvoiceAmount${limit}`];
    const exclusionItem = invoicesItems?.find(item => item.currency === activeAccount.value?.currency);

    if (exclusionItem?.[`amount${limit}`]) {
      const { amount, currency } = formatBalance(exclusionItem.currency, exclusionItem[`amount${limit}`]);
      return `${amount} ${currency}`;
    }

    if (invoiceBase) {
      const { amount, currency } = getEquivalentFromBase(invoiceBase, activeAccount.value?.currency);
      return `${amount} ${currency}`;
    }

    return undefined;
  };

  const getBetAmount = (category: 'casino' | 'sportsbook', limit: 'From' | 'To'): string | undefined => {
    const playerBonusAmount =
      category === 'casino'
        ? props.bonusInfo.wagerCasinoConditions?.[`amount${limit}`]
        : props.bonusInfo.wagerSportsbookConditions?.[`amount${limit}`];

    if (playerBonusAmount) {
      const { amount, currency } = formatBalance(props.bonusInfo.currency, playerBonusAmount);
      return `${amount} ${currency}`;
    }

    const betItems =
      category === 'casino'
        ? props.bonusInfo.wagerCasinoConditions?.amountItems
        : props.bonusInfo.wagerSportsbookConditions?.amountItems;

    const amountBase =
      category === 'casino'
        ? props.bonusInfo.wagerCasinoConditions?.[`baseCurrencyAmount${limit}`]
        : props.bonusInfo.wagerSportsbookConditions?.[`baseCurrencyAmount${limit}`];

    const exclusionItem = betItems?.find(item => item.currency === activeAccount.value?.currency);

    if (exclusionItem?.[`amount${limit}`]) {
      const { amount, currency } = formatBalance(exclusionItem.currency, exclusionItem[`amount${limit}`]);
      return `${amount} ${currency}`;
    }

    if (amountBase) {
      const { amount, currency } = getEquivalentFromBase(amountBase, activeAccount.value?.currency);
      return `${amount} ${currency}`;
    }

    return undefined;
  };

  const getMaxWinAmount = (): string | undefined => {
    if (props.bonusInfo.maxWinMultiplier) {
      let winAmount = 0;
      let winCurrency = activeAccount.value?.currency;

      if (props.bonusInfo.amount) {
        const { amount, currency } = formatBalance(props.bonusInfo.currency, props.bonusInfo.amount);
        winAmount = amount;
        winCurrency = currency;
      } else {
        const amountItems = props.bonusInfo.assignConditions?.amountItems;
        const amountBase = props.bonusInfo.assignConditions?.baseCurrencyAmount;
        const exclusionItem = amountItems?.find(item => item.currency === activeAccount.value?.currency);
        if (exclusionItem) {
          const { amount, currency } = formatBalance(props.bonusInfo.currency, exclusionItem.amount);
          winAmount = amount;
          winCurrency = currency;
        }

        if (amountBase) {
          const { amount, currency } = getEquivalentFromBase(amountBase, activeAccount.value?.currency);
          winAmount = amount;
          winCurrency = currency;
        }
      }

      const maxWinSum = winAmount * props.bonusInfo.maxWinMultiplier;
      const roundMaxWin = Number(maxWinSum.toFixed(activeAccountType.value === 'fiat' ? 2 : 8));
      return `${roundMaxWin} ${winCurrency}`;
    }

    const maxWinPlayerBonusAmount = props.bonusInfo.maxWinAmount;
    if (maxWinPlayerBonusAmount) {
      const { amount, currency } = formatBalance(props.bonusInfo.currency, maxWinPlayerBonusAmount);
      return `${amount} ${currency}`;
    }
    const maxWinItems = props.bonusInfo.maxWinAmountItems;
    const maxWinAmountBase = props.bonusInfo.baseCurrencyMaxWinAmount;
    return getSumFromAmountItems(maxWinItems, maxWinAmountBase);
  };

  const getBooleanValue = (paramName: string): string | undefined => {
    const trueLabel = getContent(props.currentLocaleData, props.defaultLocaleData, 'trueLabel');
    const falseLabel = getContent(props.currentLocaleData, props.defaultLocaleData, 'falseLabel');
    return props.bonusInfo[paramName] ? trueLabel : falseLabel;
  };

  const getMaxBonusAmount = (): string | undefined => {
    const maxAmountItems = props.bonusInfo.assignConditions?.maxBonusAmountItems;
    const baseCurrencyMaxAmount = props.bonusInfo.assignConditions?.baseCurrencyMaxAmount;
    return getSumFromAmountItems(maxAmountItems, baseCurrencyMaxAmount);
  };

  const tableParams = ref<IParam[]>();
  const getCashParams = (): IParam[] => {
    const stickyValue = props.bonusInfo.sticky !== null ? getBooleanValue('sticky') : undefined;
    const params: ICashParams = {
      minDeposit: { label: getParamLabel('minDeposit'), value: getDeposit('From') },
      maxDeposit: { label: getParamLabel('maxDeposit'), value: getDeposit('To') },
      casinoWager: { label: getParamLabel('casinoWager'), value: props.bonusInfo.wagerCasino },
      casinoMinBet: { label: getParamLabel('casinoMinBet'), value: getBetAmount('casino', 'From') },
      casinoMaxBet: { label: getParamLabel('casinoMaxBet'), value: getBetAmount('casino', 'To') },
      sportsBookWager: { label: getParamLabel('sportsBookWager'), value: props.bonusInfo.wagerSportsbook },
      sportsBookMinBet: { label: getParamLabel('sportsBookMinBet'), value: getBetAmount('sportsbook', 'From') },
      sportsBookMaxBet: { label: getParamLabel('sportsBookMaxBet'), value: getBetAmount('sportsbook', 'To') },
      maxWin: { label: getParamLabel('maxWin'), value: getMaxWinAmount() },
      sticky: { label: getParamLabel('sticky'), value: stickyValue },
      cashable: { label: getParamLabel('cashable'), value: getBooleanValue('cashable') },
    };

    return Object.keys(params).map(key => ({ ...params[key], id: key }));
  };

  const getPercentParams = (): IParam[] => {
    const params: IPercentParams = {
      depositPercentage: {
        label: getParamLabel('depositPercentage'),
        value: props.bonusInfo.assignConditions.depositPercentage,
      },
      maxBonusAmount: { label: getParamLabel('maxBonusAmount'), value: getMaxBonusAmount() },
    };

    return Object.keys(params).map(key => ({ ...params[key], id: key }));
  };

  const getFreeSpinParams = async (): Promise<IParam[]> => {
    const gameProviders = await getProviderList();
    const gameProviderId = props.bonusInfo.providerId || props.bonusInfo.assignConditions?.providerId;
    const providerName = gameProviders.find(provider => provider.id === gameProviderId)?.name;

    const params: IFreeSpinParams = {
      provider: { label: getParamLabel('provider'), value: providerName },
      game: { label: getParamLabel('game'), value: props.bonusInfo.freeSpinGameInfo?.name },
      minDeposit: { label: getParamLabel('minDeposit'), value: getDeposit('From') },
      maxDeposit: { label: getParamLabel('maxDeposit'), value: getDeposit('To') },
    };

    return Object.keys(params).map(key => ({ ...params[key], id: key }));
  };

  const setTableParams = async (): Promise<void> => {
    if ([1, 4].includes(props.bonusInfo.type || -1) || [1, 2, 4].includes(props.bonusInfo.bonusType || -1)) {
      tableParams.value = getCashParams();
    } else if (props.bonusInfo.type === 2) {
      const cashPrams = getCashParams();
      const percentParams = getPercentParams();
      tableParams.value = [...percentParams, ...cashPrams];
    } else if (props.bonusInfo.type === 3 || props.bonusInfo.bonusType === 3) {
      tableParams.value = await getFreeSpinParams();
    }
  };

  setTableParams();
</script>
