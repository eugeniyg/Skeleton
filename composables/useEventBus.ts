import mitt from 'mitt';
import type { IAnalyticsEvent } from '@skeleton/types';
import type { IMessage, ISocketInvoice } from '@skeleton/api/types';
import type { IAlert } from '~/types';

type ApplicationEvents = {
  changeMobileGameMode: undefined;
  profileUpdated: undefined;
  freeSpinsUpdated: undefined;
  bonusesUpdated: undefined;
  accountChanged: undefined;
  restrictedBets: string;
  maxBets: {
    gameIdentity: string;
    maxBet: string;
  };
  analyticsEvent: IAnalyticsEvent;
  completedQuestsUpdated: undefined;
  expiredQuestsUpdated: undefined;
  markAsReadMessage: IMessage;
  newPlayerMessage: undefined;
  markAllAsReadMessages: undefined;
  receivedAsyncInvoice: ISocketInvoice;
  depositInvoiceUpdated: undefined;
  questActivated: undefined;
  webSocketReconnected: undefined;
  delayedNotification: IAlert;
  wheelSpinsIssued: string;
  invoicesStatisticsUpdated: undefined;
  loyaltyLevelUpdated: undefined;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
export const useUnlisten = emitter.off;
