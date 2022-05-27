import { useFetchInstance } from './apiInstance';
import { useGlobalMethods } from './useGlobalMethods';

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
    const { createFormData } = useGlobalMethods();
    const bodyData = createFormData(profileData);
    const { data } = await useFetchInstance('/api/player/profile', { method: 'PUT', body: bodyData });
    return data;
  };

  const changePromo = async (promoData:any):Promise<any> => {
    const { createFormData } = useGlobalMethods();
    const bodyData = createFormData(promoData);
    const { data } = await useFetchInstance('/api/player/profile/promo', { method: 'PUT', body: bodyData });
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
