import mitt from 'mitt';

type ApplicationEvents = {
  'changeMobileGameMode': undefined;
  'profileUpdated': undefined;
  'freeSpinsUpdated': undefined;
  'bonusesUpdated': undefined;
  'accountChanged': undefined;
  'restrictedBets': string;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
export const useUnlisten = emitter.off;