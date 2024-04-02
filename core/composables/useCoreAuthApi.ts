import type {
  IAuthorizationRequest,
  IAuthorizationResponse,
  IField
} from '../types';
import { useApiGuestInstance } from "@skeleton/core/assets/apiGuestInstance";
import { useApiAuthInstance } from "@skeleton/core/assets/apiAuthInstance";

export const useCoreAuthApi = () => {
  const getRegistrationFields = async ():Promise<IField[]> => {
    const { data } = await useApiGuestInstance('/api/player/fields/validations', {
      params: { scenario: 'registration' }
    });
    return data;
  };

  const submitRegistrationData = async (registrationFormData:any):Promise<IAuthorizationResponse> => {
    const { data } = await useApiAuthInstance('/api/player/register', {
      method: 'POST',
      body: registrationFormData
    });

    return data;
  };

  const submitLoginData = async (authorizationFormData: IAuthorizationRequest):Promise<IAuthorizationResponse> => {
    const { data } = await useApiAuthInstance('/api/player/sessions', {
      method: 'POST',
      body: authorizationFormData
    });

    return data;
  };

  const submitAutologinData = async (token: string):Promise<IAuthorizationResponse> => {
    const { data } = await useApiAuthInstance('/api/player/sessions/token', {
      method: 'POST',
      body: { token }
    });

    return data;
  };

  const refreshToken = async ():Promise<IAuthorizationResponse> => {
    const { getSessionToken } = useProfileStore();
    const token = getSessionToken();
    const { data }: { data: IAuthorizationResponse } = await $fetch('/api/player/sessions/refresh', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    });

    return data;
  };

  const logOut = async ():Promise<{message: string}> => {
    const { data } = await useApiAuthInstance('/api/player/sessions/logout', {
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
