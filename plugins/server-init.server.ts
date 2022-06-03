import { useAuthApi } from '~/CORE/index';

const useAppCookie = () => useCookie('bearer');

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) {
    const { getProfileData } = useProfileStore();
    const bearer = useAppCookie();
    if (bearer.value) {
      try {
        await getProfileData();
      } catch (error) {
        if (error.response?.status === 401) {
          const { refreshToken } = useAuthApi();
          const { setToken } = useProfileStore();
          try {
            const refresh = await refreshToken();
            setToken(refresh);
          } catch {
            bearer.value = undefined;
          }
        }
      }
    }
  }
});
