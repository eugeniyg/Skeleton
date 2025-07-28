import type { IAmountRangeItem, IBonus } from '@skeleton/api/types';

export const formatBalance = (
  currency: string | undefined,
  amount: number | undefined
): { currency: string; amount: number } => {
  if (!currency && amount === undefined) return { currency: '', amount: 0 };
  if (!currency) return { currency: '', amount: amount || 0 };
  if (amount === undefined) return { currency, amount: 0 };

  const { currencies } = useGlobalStore();
  const currencyConfig = currencies.find(item => item.code === currency);
  if (!currencyConfig) return { currency, amount };

  const specialCurrencies = ['BTC', 'ETH'];
  if (currencyConfig.type === 'fiat' || !specialCurrencies.includes(currencyConfig.code)) return { currency, amount };

  const subCurrencyConfig = currencyConfig.subCurrencies?.find(subCurrency => subCurrency.subunitToUnit === 1000);
  if (amount === 0) return { currency: subCurrencyConfig?.code || '', amount };

  return {
    currency: subCurrencyConfig?.code || '',
    amount: Number((amount * 1000).toFixed(8))
  };
};

export const getMainBalanceFormat = (currency: string, amount: number): { currency: string; amount: number } => {
  const { currencies } = useGlobalStore();
  const currencyConfig = currencies.find(item => {
    if (!item.subCurrencies?.length) return item.code === currency;

    return item.subCurrencies.some(subCurrency => subCurrency.code === currency);
  });
  if (!currencyConfig) return { currency, amount };
  const specialCurrencies = ['BTC', 'ETH'];
  if (currencyConfig.type === 'fiat' || !specialCurrencies.includes(currencyConfig.code)) return { currency, amount };

  const subCurrencyConfig = currencyConfig.subCurrencies?.find(subCurrency => subCurrency.code === currency);
  if (amount === 0) return { currency: currencyConfig.code, amount };

  return { currency: currencyConfig.code, amount: amount / (subCurrencyConfig?.subunitToUnit || 1) };
};

export const getEquivalentAccount = (
  targetBalance: number | undefined,
  targetCurrency: string | undefined
): {
  balance: number;
  currency: string;
  currencySymbol: string;
} => {
  const { baseCurrency, equivalentCurrency, currencies } = useGlobalStore();
  if (!baseCurrency || !equivalentCurrency) return { balance: 0, currency: '', currencySymbol: '' };
  const currentCurrency = currencies.find(currency => currency.code === targetCurrency);
  if (!currentCurrency) return { balance: 0, currency: '', currencySymbol: '' };

  // here baseAmount will be in float
  const balanceInBaseCurrency = (targetBalance || 0) * (currentCurrency.subunitToUnit / currentCurrency.rate.rate);

  // convert to int + divide onto rate
  const equivalentAmount = balanceInBaseCurrency * (equivalentCurrency.rate.rate / baseCurrency.subunitToUnit);

  return {
    balance: Number(equivalentAmount.toFixed(2)),
    currency: equivalentCurrency.code,
    currencySymbol: equivalentCurrency.symbol,
  };
};

export const getEquivalentFromBase = (
  baseAmount: number | undefined,
  targetCurrencyCode: string | undefined
): {
  amount: number;
  currency: string;
} => {
  const { currencies } = useGlobalStore();
  const targetCurrency = currencies.find(currency => currency.code === targetCurrencyCode);

  if (!targetCurrency || !baseAmount) return { amount: 0, currency: '' };

  const balance = (baseAmount * targetCurrency.rate.rate) / targetCurrency.subunitToUnit;
  return formatBalance(targetCurrency.code, balance);
};

export const getSumFromAmountItems = (
  exclusionItems?: { amount: number; currency: string }[],
  baseAmount?: number | null
): string | undefined => {
  const { activeAccount } = useWalletStore();

  const exclusionItem = exclusionItems?.find(item => item.currency === activeAccount?.currency);

  if (exclusionItem) {
    const { amount, currency } = formatBalance(exclusionItem.currency, exclusionItem.amount);
    return `${amount} ${currency}`;
  }

  if (baseAmount) {
    const { amount, currency } = getEquivalentFromBase(baseAmount, activeAccount?.currency);
    return `${amount} ${currency}`;
  }

  return undefined;
};

export const getMinBonusDeposit = (bonusInfo: IBonus): { amount: number; currency: string } | undefined => {
  let minDeposit: { amount: number; currency: string } | undefined;

  const invoiceItems: IAmountRangeItem[] | undefined = bonusInfo.triggerConditions?.invoiceAmountItems;
  const baseCurrencyInvoiceFrom = bonusInfo.triggerConditions?.baseCurrencyInvoiceAmountFrom;
  const { activeAccount } = useWalletStore();

  if (invoiceItems?.length) {
    const currentCurrencyInvoiceItem = invoiceItems.find(
      invoiceItem => invoiceItem.currency === activeAccount?.currency
    );
    if (currentCurrencyInvoiceItem && currentCurrencyInvoiceItem.amountFrom) {
      minDeposit = formatBalance(currentCurrencyInvoiceItem.currency, currentCurrencyInvoiceItem.amountFrom);
    }
  }

  if (!minDeposit && baseCurrencyInvoiceFrom) {
    minDeposit = getEquivalentFromBase(baseCurrencyInvoiceFrom, activeAccount?.currency);
  }

  return minDeposit;
};
