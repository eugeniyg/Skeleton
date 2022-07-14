import { useFetchInstance } from './apiInstance';
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

  const refreshToken = async ():Promise<AuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/sessions/refresh', {
      method: 'POST',
    });
    return data;
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
