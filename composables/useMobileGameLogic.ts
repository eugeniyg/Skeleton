import type { IGame } from '@skeleton/core/types';

export const useMobileGameLogic = (gameInfo: IGame) => {
  const profileStore = useProfileStore();
  const walletStore = useWalletStore();
  const { localizePath } = useProjectMethods();
  const { openMobileGameModal } = useGamesStore();
  const router = useRouter();

  const { isLoggedIn } = storeToRefs(profileStore);
  const { activeAccount } = storeToRefs(walletStore);

  const resolveLoggedWithoutBalance = async (): Promise<void> => {
    if (gameInfo.isDemoMode) await openMobileGameModal('depositOrDemo', gameInfo);
    else await openMobileGameModal('deposit', gameInfo);
  };
  const resolveLogged = async (): Promise<void> => {
    if (activeAccount.value?.balance) {
      await router.push(localizePath(`/games/${gameInfo.identity}?real=true`));
    } else {
      return await resolveLoggedWithoutBalance();
    }
  };

  const resolveUnlogged = async (): Promise<void> => {
    if (gameInfo.isDemoMode) {
      await openMobileGameModal('registerOrDemo', gameInfo);
    } else {
      await openMobileGameModal('registerOrLogin', gameInfo);
    }
  };

  const openGame = async (): Promise<void> => {
    if (isLoggedIn.value) {
      await resolveLogged();
    } else {
      await resolveUnlogged();
    }
  };

  return {
    openGame,
  };
};
