import { defineStore } from 'pinia';
import { AuthorizationResponse } from './types';

export type CoreStoreStateType = {
  refreshPromise: Promise<AuthorizationResponse>,
}

export const useCoreStore = defineStore('useCoreStore', {
  state: () => ({
    refreshPromise: undefined,
  } as CoreStoreStateType),
});
