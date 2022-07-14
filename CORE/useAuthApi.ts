import { useFetchInstance } from './apiInstance';
import { useCoreStore } from './useCoreStore';
import { AuthorizationResponse, FieldInterface } from './types';

const useAuthApi = () => {
  const getRegistrationFields = async ():Promise<FieldInterface> => {
    const { data } = await useFetchInstance('/api/player/fields/validations?scenario=registration');
    return data;
  };

  const submitRegistrationData = async (registrationFormData:any):Promise<AuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/register', {
      method: 'POST',
      body: registrationFormData,
    });
    return data;
  };

  const submitLoginData = async (authorizationFormData: any):Promise<AuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/sessions', {
      method: 'POST',
      body: authorizationFormData,
    });
    return data;
  };

  const refreshToken = ():any => {
    const coreStore = useCoreStore();
    if (!coreStore.refreshPromise) {
      coreStore.refreshPromise = useFetchInstance('/api/player/sessions/refresh', {
        method: 'POST',
      });
    }
    return coreStore.refreshPromise;
  };

  const logOut = async ():Promise<{message: string}> => {
    const { data } = await useFetchInstance('/api/player/sessions/logout', {
      method: 'POST',
    });
    return data;
  };

  return {
    getRegistrationFields,
    submitRegistrationData,
    submitLoginData,
    refreshToken,
    logOut,
  };
};

export { useAuthApi };
