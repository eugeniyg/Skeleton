import type { IAuthorizationResponse, IField } from '../types';
import { useFetchInstance } from '../assets/apiInstance';

export const useCoreAuthApi = () => {
  const getRegistrationFields = async ():Promise<IField[]> => {
    const { data } = await useFetchInstance('/api/player/fields/validations', {
      params: { scenario: 'registration' }
    });
    return data;
  };

  const submitRegistrationData = async (registrationFormData:any):Promise<IAuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/register', {
      method: 'POST',
      body: registrationFormData
    });

    const { setSessionToken } = useProfileStore();
    setSessionToken(data.accessToken);

    return data;
  };

  const submitLoginData = async (authorizationFormData: any):Promise<IAuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/sessions', {
      method: 'POST',
      body: authorizationFormData
    });

    const { setSessionToken } = useProfileStore();
    setSessionToken(data.accessToken);

    return data;
  };

  const submitAutologinData = async (token: string):Promise<IAuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/sessions/token', {
      method: 'POST',
      body: { token }
    });

    const { setSessionToken } = useProfileStore();
    setSessionToken(data.accessToken);

    return data;
  };

  const refreshToken = async (options:any):Promise<{data: IAuthorizationResponse}> => {
    const coreAuthStore = useProfileStore();
    if (coreAuthStore.refreshPromise) {
      return coreAuthStore.refreshPromise;
    }

    try {
      const refreshPromise:Promise<{data: IAuthorizationResponse}> = $fetch('/api/player/sessions/refresh', {
        ...options,
        method: 'POST'
      });

      coreAuthStore.refreshPromise = refreshPromise;

      return await refreshPromise;
    } catch (err: any) {
      console.log('refresh-error:', err)
    } finally {
      coreAuthStore.refreshPromise = null;
    }
  };

  const logOut = async ():Promise<{message: string}> => {
    try {
      const { data } = await useFetchInstance('/api/player/sessions/logout', {
        method: 'POST'
      });
      return data;
    } finally {
      const { removeSession } = useProfileStore();
      removeSession();
    }
  };

  return {
    getRegistrationFields,
    submitRegistrationData,
    submitLoginData,
    submitAutologinData,
    refreshToken,
    logOut
  };
}
