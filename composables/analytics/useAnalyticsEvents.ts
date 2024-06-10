import mitt from 'mitt';
import type {
  IBalanceEvent,
  IRegistrationEvent,
  IWalletEvent
} from "@skeleton/types/analytics";

type AnalyticsEvents = {
  'sendEvent': IRegistrationEvent;
  'balance': IBalanceEvent;
  'wallet': IWalletEvent;
};

const emitter = mitt<AnalyticsEvents>();

export const useAnalyticsEvent = emitter.emit;
export const useAnalyticsListen = emitter.on;
export const useAnalyticsUnlisten = emitter.off;