import { defineStore } from 'pinia';
import { useApiInstance } from './useApiInstance';

export const useProfileApi = defineStore('profileApi', {
  actions: {
    async getProfile():Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/profile');
      return data;
    },

    async getProfileFields():Promise<any> {
      const { apiInstance } = useApiInstance();
      try {
        const { data } = await apiInstance('/api/player/fields/validations?scenario=profile');
        return data;
      } catch (error:any) {
        return throwError(error);
      }
    },

    async changeProfileData(profileData:any):Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/profile', { method: 'PUT', body: profileData });
      return data;
    },

    async changePromo(promoData:any):Promise<any> {
      const { apiInstance } = useApiInstance();
      const { data } = await apiInstance('/api/player/profile/promo', { method: 'PUT', body: promoData });
      return data;
    },
  },
});
