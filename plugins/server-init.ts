// import parser from 'accept-language-parser';
// import { useAuthApi } from '~/CORE/index';

const useAppCookie = () => useCookie('bearer');

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) {
    const globalStore = useGlobalStore();
    globalStore.baseApiUrl = process.env.API_BASE_URL || '';
  }

  if (process.client) {
    // const { parseUserAgent, setBrowserLanguage } = useGlobalStore();
    // const languages = parser.parse(nuxtApp.ssrContext.req.headers['accept-language']);
    // setBrowserLanguage(languages);
    // const userAgent = nuxtApp.ssrContext.req.headers['user-agent'];
    // parseUserAgent(userAgent);

    const { getProfileData } = useProfileStore();
    const { getUserAccounts } = useWalletStore();
    const bearer = useAppCookie();
    if (bearer.value) {
      try {
        await Promise.all([
          getProfileData(),
          getUserAccounts(),
        ]);
      } catch (error) {
        if (error.response?.status === 401) {
          const { logOutUser } = useProfileStore();
          logOutUser();
        } else {
          console.log(error);
        }
      }
    }
  }
});
