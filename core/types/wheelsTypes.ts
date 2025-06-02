import type {IPaginationMeta} from "@skeleton/core/types/globalTypes";

export interface WheelSector {
  id: string;
  title: string;
  dropRate?: number;
}

export interface PlayerWheelSpin {
  id: string;
  expireAt: string;
}

export interface IWheel {
  id: string;
  state: number;
  title: string;
  identity: string;
  items: WheelSector[];
  endAt: string | null;
  playerSpins: PlayerWheelSpin[];
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
