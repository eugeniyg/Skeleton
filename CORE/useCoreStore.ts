import { defineStore } from 'pinia';
import { AuthorizationResponse } from './types';

export type CoreStoreStateType = {
  refreshPromise: Promise<{data: AuthorizationResponse}>,
  invoiceStatuses: { id: number, name: string }[],
  invoiceTypes: { id: number, name: string }[],
}

export const useCoreStore = defineStore('useCoreStore', {
  state: () => ({
    refreshPromise: undefined,
    invoiceStatuses: [
      {
        id: 0,
        name: 'review',
      },
      {
        id: 1,
        name: 'pending',
      },
      {
        id: 2,
        name: 'success',
      },
      {
        id: 3,
        name: 'rejected',
      },
    ],
    invoiceTypes: [
      {
        id: 1,
        name: 'deposit',
      },
      {
        id: 2,
        name: 'withdrawal',
      },
    ],
  } as CoreStoreStateType),
});
