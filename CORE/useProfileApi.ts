import { useFetchInstance } from './apiInstance';
import { ChangePasswordRequestInterface, FieldInterface, ProfileInterface } from './types';

const useProfileApi = () => {
  const getProfile = async ():Promise<ProfileInterface> => {
    const { data } = await useFetchInstance('/api/player/profile');
    return data;
  };

  const getProfileFields = async ():Promise<FieldInterface> => {
    const { data } = await useFetchInstance('/api/player/fields/validations?scenario=profile');
    return data;
  };

  const changeProfileData = async (profileData:any):Promise<ProfileInterface> => {
    const { data } = await useFetchInstance('/api/player/profile', { method: 'PUT', body: profileData });
    return data;
  };

  const changeProfilePassword = async (passwordData:ChangePasswordRequestInterface):Promise<ProfileInterface> => {
    const { data } = await useFetchInstance('/api/player/passwords', { method: 'PUT', body: passwordData });
    return data;
  };

  const changePromo = async (promoData:any):Promise<ProfileInterface> => {
    const { data } = await useFetchInstance('/api/player/profile/promo', { method: 'PUT', body: promoData });
    return data;
  };

  return {
    getProfile,
    getProfileFields,
    changeProfileData,
    changePromo,
    changeProfilePassword,
  };
};

export { useProfileApi };
