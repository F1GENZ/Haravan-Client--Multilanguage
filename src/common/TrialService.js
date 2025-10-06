import { useQuery } from '@tanstack/react-query';
import httpClient from '../config/AxiosConfig';

/**
 * Get trial period information
 */
const getTrialInfo = async (shop) => {
  const response = await httpClient.get('/api/token/trial', {
    params: { shop }
  });
  return response.data;
};

/**
 * Custom hook to get trial period info
 */
export const useTrialInfo = (shop) => {
  return useQuery({
    queryKey: ['trial', shop],
    queryFn: () => getTrialInfo(shop),
    enabled: !!shop, // Only run if shop is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute to keep countdown updated
    retry: 3, // Retry 3 times on failure
    retryDelay: 1000, // Wait 1s between retries
  });
};

export const trialService = {
  getTrialInfo,
  useTrialInfo,
};
