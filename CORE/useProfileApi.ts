import { useFetchInstance } from './apiInstance';

const useProfileApi = () => {
  const getProfile = async ():Promise<any> => {
    const { data } = await useFetchInstance('/api/player/profile');
    return data;
  };

  const getProfileFields = async ():Promise<any> => {
    try {
      const { data } = await useFetchInstance('/api/player/fields/validations?scenario=profile');
      return data;
    } catch (error:any) {
      return throwError(error);
    }
  };

  const changeProfileData = async (profileData:any):Promise<any> => {
    const { data } = await useFetchInstance('/api/player/profile', { method: 'PUT', body: profileData });
    return data;
  };

  const changePromo = async (promoData:any):Promise<any> => {
    const { data } = await useFetchInstance('/api/player/profile/promo', { method: 'PUT', body: promoData });
    return data;
  };

  return {
    getProfile,
    getProfileFields,
    changeProfileData,
    changePromo,
  };
};

export { useProfileApi };
