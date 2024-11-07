import { storeToRefs } from 'pinia';
import type { IGame } from '@skeleton/core/types';

export const useMobileGameLogic = (gameInfo: IGame) => {
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { localizePath } = useProjectMethods();
  const { openMobileGameModal } = useGamesStore();
  const router = useRouter();

  const { isLoggedIn } = storeToRefs(profileStore);
  const { activeAccount } = storeToRefs(walletStore);

  const resolveLoggedWithoutBalance = (): void => {
    if (gameInfo.isDemoMode) openMobileGameModal('depositOrDemo', gameInfo);
    else openMobileGameModal('deposit', gameInfo);
  };
  const resolveLogged = (): void => {
    if (activeAccount.value?.balance) {
      router.push(localizePath(`/games/${gameInfo.identity}?real=true`));
    } else {
      return resolveLoggedWithoutBalance();
    }
  };

  const resolveUnlogged = (): void => {
    if (gameInfo.isDemoMode) {
      openMobileGameModal('registerOrDemo', gameInfo);
    } else {
      openMobileGameModal('registerOrLogin', gameInfo);
    }
  };

  const openGame = () => {
    if (isLoggedIn.value) {
      resolveLogged();
    } else {
      resolveUnlogged();
    }
  };

  return {
    openGame,
  };
};
