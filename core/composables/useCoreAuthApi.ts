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

    return data;
  };

  const submitLoginData = async (authorizationFormData: any):Promise<IAuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/sessions', {
      method: 'POST',
      body: authorizationFormData
    });

    return data;
  };

  const submitAutologinData = async (token: string):Promise<IAuthorizationResponse> => {
    const { data } = await useFetchInstance('/api/player/sessions/token', {
      method: 'POST',
      body: { token }
    });

    return data;
  };

  const refreshToken = async (options:any):Promise<IAuthorizationResponse> => {
    const { data }: { data: IAuthorizationResponse } = await $fetch('/api/player/sessions/refresh', {
      ...options,
      method: 'POST'
    });

    return data;
  };

  const logOut = async ():Promise<{message: string}> => {
    const { data } = await useFetchInstance('/api/player/sessions/logout', {
      method: 'POST'
    });

    return data;
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
