import mitt from 'mitt';
import type { IAnalyticsEvent } from "@skeleton/types";

type ApplicationEvents = {
  'changeMobileGameMode': undefined;
  'profileUpdated': undefined;
  'freeSpinsUpdated': undefined;
  'bonusesUpdated': undefined;
  'accountChanged': undefined;
  'restrictedBets': string;
  'maxBets': {
    gameIdentity: string;
    maxBet: string;
  };
  'analyticsEvent': IAnalyticsEvent;
  'questUpdated': undefined;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
export const useUnlisten = emitter.off;