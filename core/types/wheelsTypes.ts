import type { IPaginationMeta } from '@skeleton/core/types/globalTypes';

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
