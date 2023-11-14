import mitt from 'mitt';

type ApplicationEvents = {
  'changeMobileGameMode': undefined;
};

const emitter = mitt<ApplicationEvents>();

export const useEvent = emitter.emit;
export const useListen = emitter.on;
export const useUnlisten = emitter.off;