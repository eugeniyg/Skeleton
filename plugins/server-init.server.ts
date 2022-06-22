import parser from 'accept-language-parser';
import { useAuthApi } from '~/CORE/index';

const useAppCookie = () => useCookie('bearer');

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) {
    const { parseUserAgent, setBrowserLanguage } = useGlobalStore();
    const languages = parser.parse(nuxtApp.ssrContext.req.headers['accept-language']);
    setBrowserLanguage(languages);
    const userAgent = nuxtApp.ssrContext.req.headers['user-agent'];
    parseUserAgent(userAgent);

    const { getProfileData } = useProfileStore();
    const { getUserAccounts } = useWalletStore();
    const bearer = useAppCookie();
    console.log(bearer.value);
    if (bearer.value) {
      try {
        await Promise.all([
          getProfileData(),
          getUserAccounts(),
        ]);
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
        } else {
          console.log(error);
        }
      }
    }
  }
});
