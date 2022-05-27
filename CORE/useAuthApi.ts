import { useFetchInstance } from './apiInstance';
import { useGlobalMethods } from './useGlobalMethods';

const useAuthApi = () => {
  const getRegistrationFields = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/player/fields/validations?scenario=registration');
    return data;
  };

  const submitRegistrationData = async (registrationFormData:any):Promise<any> => {
    const { createFormData } = useGlobalMethods();
    const bodyData = createFormData(registrationFormData);
    const { data } = await useFetchInstance('/api/player/register', { method: 'POST', body: bodyData });
    return data;
  };

  const submitLoginData = async (authorizationFormData: any):Promise<any> => {
    const { createFormData } = useGlobalMethods();
    const bodyData = createFormData(authorizationFormData);
    const { data } = await useFetchInstance('/api/player/sessions', { method: 'POST', body: bodyData });
    return data;
  };

  const refreshToken = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/player/sessions/refresh', {
      method: 'POST',
    });
    return data;
  };

  const logOut = async ():Promise<any> => {
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
