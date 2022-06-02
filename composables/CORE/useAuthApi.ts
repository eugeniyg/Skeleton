import { defineStore } from 'pinia';
import { useApiInstance } from './useApiInstance';

export const useAuthApi = defineStore('authApi', {
  actions: {
    async getRegistrationFields():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/fields/validations?scenario=registration');
      return data;
    },

    async submitRegistrationData(registrationFormData:any):Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/register', {
        method: 'POST',
        body: registrationFormData,
      });
      return data;
    },

    async submitLoginData(authorizationFormData: any):Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/sessions', {
        method: 'POST',
        body: authorizationFormData,
      });
      return data;
    },

    async refreshToken():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/sessions/refresh', {
        method: 'POST',
      });
      return data;
    },

    async logOut():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/sessions/logout', {
        method: 'POST',
      });
      return data;
    },
  },
});