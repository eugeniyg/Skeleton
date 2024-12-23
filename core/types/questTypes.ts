import type { IPaginationMeta } from './globalTypes';

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
