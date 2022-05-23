import { useAuthApi } from '@platform/frontend-core';

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) {
    const { getProfileData } = useUserStore();
    const bearer = useCookie('bearer');
    console.log('Token:', bearer.value);
    if (bearer.value) {
      console.log('Start Request');
      try {
        await getProfileData();
      } catch (error) {
        console.log('Request Error:', error);
        if (error.response?.status === 401) {
          const { refreshToken } = useAuthApi();
          const { setToken } = useUserStore();
          try {
            const refresh = await refreshToken();
            setToken(refresh);
          } catch {
            bearer.value = undefined;
          }
        } else bearer.value = undefined;
      }
    }
  }
});
