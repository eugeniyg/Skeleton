import type { IWheelSector, IWheelsRequest, IWheelsResponse } from '@skeleton/core/types/wheelsTypes';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';
import { useApiGuestInstance } from '@skeleton/core/assets/apiGuestInstance';

export const useCoreWheelsApi = () => {
  const getWheels = async (serverSide: boolean, params?: IWheelsRequest): Promise<IWheelsResponse> => {
    if (serverSide) return await useApiGuestInstance('/api/retention/wheels', { params });
    return await useApiAuthInstance('/api/retention/wheels', { params });
  };

  const spinWheel = async (wheelId: string): Promise<IWheelSector> => {
    const { data } = await useApiAuthInstance(`/api/retention/wheels/${wheelId}/spin`, {
      method: 'POST',
    });
    return data;
  };

  return {
    getWheels,
    spinWheel,
  };
};
