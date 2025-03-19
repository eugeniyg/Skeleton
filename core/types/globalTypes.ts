import type { IAccount, ISocketInvoice } from './walletTypes';
import type { IGameImages, IWinner } from './gameTypes';
import type { IBonusCode, IPlayerBonus, IPlayerFreeSpin } from './bonusTypes';
import type { IPlayerQuest, IPlayerQuestEventTask } from '@skeleton/core/types/questTypes';
import type { IPlayerLoyaltyAccount } from '@skeleton/core/types/profileTypes';
import type { IMessage } from '@skeleton/core/types/notificationTypes';
import type { ITournamentParticipant, ITournamentPrize } from '@skeleton/core/types/tournamentsTypes';

export interface IRate extends Record<string, any> {
  rate: number;
  rateTime: string;
}

export interface ICurrency extends Record<string, any> {
  name: string;
  isBase: boolean;
  isEnabled: boolean;
  code: string;
  symbol: string;
  type: string;
  subunitToUnit: number;
  rate: IRate;
  subCurrencies?: ICurrency[];
  value?: string;
}

export interface ILocale extends Record<string, any> {
  name: string;
  nativeName: string;
  code: string;
  languageCode: string;
  isDefault: boolean;
  value?: string;
}

export interface ICountry extends Record<string, any> {
  name: string;
  nativeName: string;
  code: string;
  phonePrefix: string;
  currency: string;
  locale: string;
  additionalCurrency: string[];
  value?: string;
  restrict: boolean;
}

export interface ITimeZone extends Record<string, any> {
  id: string;
  name: string;
  code?: string;
  value?: string;
}

export interface IStatus extends Record<string, any> {
  id: string | number;
  name: string;
}

export interface IDocumentType extends Record<string, any> {
  id: string;
  name: string;
  section: string;
}

export interface ICoreConstants extends Record<string, any> {
  player: {
    scenarios: IStatus[];
    timeZone: ITimeZone[];
    playerStatuses: IStatus[];
    document: {
      status: IStatus[];
      type: IDocumentType[];
    };
    limit: {
      definition: IStatus[];
      status: IStatus[];
      allPeriod: IStatus[];
      cashPeriod: IStatus[];
      coolingOffPeriod: IStatus[];
      selfExclusionPeriod: IStatus[];
    };
    registration: {
      phone: boolean;
      email: boolean;
    };
    otp: {
      enabled: boolean;
      reason: string[];
    };
    socialAuth: string[];
  };
  payment: {
    invoiceStatuses: IStatus[];
    invoiceTypes: IStatus[];
  };
  game: {
    bet: {
      status: IStatus[];
      transactionType: IStatus[];
      amountType: IStatus[];
    };
    spin: {
      transactionType: IStatus[];
    };
    bonus: {
      triggerType: IStatus[];
      type: IStatus[];
      status: IStatus[];
      wagerSportsbookTicketType: IStatus[];
      wagerSportsbookStage: IStatus[];
      payoutBalanceType: IStatus[];
      wagerCategory: IStatus[];
      depositBonusDeclineDefault: boolean;
    };
    playerBonus: {
      status: IStatus[];
      result: IStatus[];
    };
    playerFreespin: {
      status: IStatus[];
      result: IStatus[];
    };
  };
}

export interface IObserverOptions extends Record<string, any> {
  once?: boolean;
  onInView?: () => void;
  onOutView?: () => void;
  settings: { root: null | HTMLElement; rootMargin: string; threshold: number };
}

export interface IPaginationMeta extends Record<string, any> {
  page: number;
  perPage: number;
  totalPages: number;
  totalRows: number;
}

export interface IEventBet extends Record<string, any> {
  id: string;
  nickname: string | null;
  amount: number;
  baseCurrencyAmount: number;
  currency: string;
  payout: number;
  baseCurrencyPayout: number;
  gameId: string;
  gameName: string;
  gameImages: IGameImages;
  gameCustomImages: IGameImages;
  createdAt: string;
}

export interface IEventTournament extends Record<string, any> {
  id: string;
  title: string;
  identity: string;
  state: number;
  prizes: ITournamentPrize[];
  endAt: string;
}

export interface IEventTournamentEntry extends Record<string, any> {
  tournamentId: string;
  playerId: string;
  points: number;
  place: number;
}

export interface IWebSocketResponse extends Record<string, any> {
  data: {
    event: string;
    winner?: IWinner;
    account?: IAccount;
    invoice?: ISocketInvoice;
    playerBonusCode?: IBonusCode;
    playerBonus?: IPlayerBonus;
    playerFreespin?: IPlayerFreeSpin;
    gameId?: string;
    gameIdentity?: string;
    quest?: IPlayerQuest;
    task?: IPlayerQuestEventTask;
    playerAccount?: IPlayerLoyaltyAccount;
    bet?: IEventBet;
    message?: IMessage;
    tournament?: IEventTournament;
    leaderboard?: ITournamentParticipant[];
    entry?: IEventTournamentEntry;
  };
  gen: undefined;
  offset: undefined;
  seq: undefined;
}

export interface IInitUserInfo extends Record<string, any> {
  country: string;
}

export interface IContactMessageRequest extends Record<string, any> {
  email: string;
  message: string;
}
