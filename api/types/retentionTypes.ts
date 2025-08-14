import type { IPaginationMeta } from './globalTypes';

export interface IPlayerLoyaltyLevel extends Record<string, any> {
  id: string;
  name: string;
  order: number;
  points: number;
}

export interface IPlayerLoyaltyAccount extends Record<string, any> {
  id: string;
  playerId: string;
  points: number;
  currentLevel: IPlayerLoyaltyLevel;
  nextLevel: IPlayerLoyaltyLevel | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ILoyaltyLevelsRequest extends Record<string, any> {
  page?: number;
  perPage?: number;
  sortBy?: 'order' | 'points';
  sortOrder?: 'asc' | 'desc';
}

export interface ILoyaltyLevel {
  id: string;
  name: string;
  order: number;
  points: number;
}

export interface ILoyaltyLevelsResponse extends Record<string, any> {
  data: ILoyaltyLevel[];
  meta: IPaginationMeta;
}

export interface ILoyaltyUpdatedEvent {
  data: {
    event: 'account.level.updated' | 'account.balance.updated';
    playerAccount: IPlayerLoyaltyAccount;
  };
}

export interface IWinTaskConditions extends Record<string, any> {
  games?: string[];
  multiplier?: number;
  maxMultiplier?: number;
  minPayout?: number;
  maxPayout?: number;
}

export interface IBetTaskConditions extends Record<string, any> {
  games?: string[];
  spinAmount?: number;
  maxSpinAmount?: number;
}

export interface IFieldsTaskConditions extends Record<string, any> {
  fields: string[];
}

export interface IPlayerQuestTask extends Record<string, any> {
  id: string;
  isCompleted: boolean;
  isActive: boolean;
  type: number;
  progress: number;
  quantity: number;
  name: string;
  description: string;
  executionOrder: number;
  conditions: Record<string, any>;
}

export interface IPlayerQuestEventTask extends Record<string, any> {
  id: string;
  isCompleted: boolean;
  isActive: boolean;
  playerId: string;
  questId: string;
  progress: number;
  quantity: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  type: number;
}

export interface IPlayerQuestReward extends Record<string, any> {
  type: number;
  attributes: {
    isoCode: string;
    lockBalance: boolean;
  };
  amount: number;
}

export interface IPlayerQuest extends Record<string, any> {
  id: string;
  playerId: string;
  state: number;
  name: string;
  identity: string;
  description: string;
  order: number;
  tasks: IPlayerQuestTask[];
  taskExecutionOrder: number;
  packageOrder: number | null;
  rewards: IPlayerQuestReward[];
  endAt: string | null;
}

export interface IAvailableQuestsRequest extends Record<string, any> {
  page?: number;
  perPage?: number;
  currency?: string;
}

export interface IPlayerQuestsRequest extends Record<string, any> {
  page?: number;
  perPage?: number;
  state?: number[];
  currency?: string;
}

export interface IPlayerQuestsResponse extends Record<string, any> {
  data: IPlayerQuest[];
  meta: IPaginationMeta;
}

export interface IQuestUpdatedEvent {
  data: {
    event: 'quest.updated';
    quest: IPlayerQuest;
  };
}

export interface IQuestTaskUpdatedEvent {
  data: {
    event: 'quest.task.updated';
    task: IPlayerQuestEventTask;
  };
}

export interface ITournamentPrize {
  place: number;
  type: number;
  title: string;
  bonusId?: string;
  entry?: {
    playerId: string;
    nickname: string;
    points: number;
    createdAt: string;
    updatedAt: string | null;
  };
}

export interface ITournamentParticipant {
  playerId: string;
  nickname: string | null;
  place: number;
  points: number;
}

export interface ITournament {
  title: string;
  type: number;
  identity: string;
  confirmationRequired: boolean;
  rates: {
    baseCurrencyRate: number;
    currencyRates?: {
      isoCode: string;
      rate: number;
    }[];
  };
  conditions: {
    gameCollections?: string[];
    gameCollectionsExcluded?: boolean;
    minAmount?: number;
    minAmountOp?: 'gt' | 'gte';
    maxAmount?: number;
    maxAmountOp?: 'lt' | 'lte';
    currencies?: {
      isoCode: string;
      minAmount?: number;
      minAmountOp?: 'gt' | 'gte';
      maxAmount?: number;
      maxAmountOp?: 'lt' | 'lte';
    }[];
  };
  startAt: string;
  endAt: string;
  id: string;
  state: number;
  isAvailable: boolean;
  playerEntry?: {
    points: number;
    place: number;
  } | null;
  prizes?: ITournamentPrize[];
  leaderboard?: ITournamentParticipant[];
}

export interface ITournamentsRequest {
  page?: number;
  perPage?: number;
  state?: number[];
  identity?: string[];
}

export interface ITournamentsResponse {
  data: ITournament[];
  meta: IPaginationMeta;
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

export interface ITournamentCompletedEvent {
  data: {
    event: 'tournament.completed';
    tournament: IEventTournament;
  };
}

export interface ITournamentLeaderboardUpdatedEvent {
  data: {
    event: 'tournament.leaderboard.updated';
    tournamentId: string;
    leaderboard: ITournamentParticipant[];
  };
}

export interface ITournamentEntryUpdatedEvent {
  data: {
    event: 'tournament.player-entry.updated';
    entry: IEventTournamentEntry;
  };
}

export interface IWheelSector {
  id: string;
  title: string;
  dropRate?: number;
}

export interface IPlayerWheelSpin {
  id: string;
  expireAt: string;
}

export interface IWheel {
  id: string;
  state: number;
  title: string;
  identity: string;
  items: IWheelSector[];
  startAt: string;
  endAt: string | null;
  playerSpins: IPlayerWheelSpin[];
  limitRefreshAt: string | null;
}

export interface IWheelsRequest {
  page?: number;
  perPage?: number;
  identity?: string[];
  state?: number[];
}

export interface IWheelsResponse {
  data: IWheel[];
  meta: IPaginationMeta;
}
export interface IEventWheel extends Record<string, any> {
  id: string;
  identity: string;
  title: string;
}

export interface IWheelSpinIssuedEvent {
  data: {
    event: 'wheel.spin.issued';
    playerId: string;
    wheel: IEventWheel;
    amount: number;
  };
}

export interface ILotteryRequest {
  page?: number;
  perPage?: number;
  state?: number[];
  identity?: string[];
  currency?: string;
}

export interface ILotteryResponse {
  data: ILottery[];
  meta: IPaginationMeta;
}

export interface ILotteryTicketPrice {
  isoCode: string | null;
  minAmount: number;
  price: number;
}

export interface ILotteryPrize {
  type: number;
  title: string;
  bonusId: string | null;
  order: number;
}

export interface ILottery {
  id: string;
  title: string;
  identity: string;
  state: number;
  segmentsExcluded: boolean;
  currencies: string[] | null;
  minPlayerTickets: number;
  maxPlayerTickets: number | null;
  ticketPrices: ILotteryTicketPrice[];
  maxPlayerPrizes: number;
  prizes: ILotteryPrize[];
  ticketsCount: number;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}
