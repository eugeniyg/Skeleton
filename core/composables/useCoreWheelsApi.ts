import type { IWheelsRequest, IWheelsResponse } from '@skeleton/core/types/wheelsTypes';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';

export const useCoreWheelsApi = () => {
  const getWheels = async (params?: IWheelsRequest): Promise<IWheelsResponse> => {
    return await useApiAuthInstance('/api/retention/wheels', { params });
  };

  return {
    getWheels,
  };
};
