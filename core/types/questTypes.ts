import type { IPaginationMeta } from './globalTypes'

export interface IPlayerQuestTask extends Record<string, any> {
  id: string;
  isCompleted: boolean;
  progress: number;
  quantity: number;
  name: string;
  description: string;
  executionOrder: number;
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
  packageOrder: number|null,
  rewards: IPlayerQuestReward[];
  endAt: string|null;
}

export interface IPlayerQuestsRequest extends Record<string, any> {
  page?: number;
  perPage?: number;
  state?: number[];
}

export interface IPlayerQuestsResponse extends Record<string, any> {
  data: IPlayerQuest[];
  meta: IPaginationMeta;
}