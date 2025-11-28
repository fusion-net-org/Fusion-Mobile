import { apiInstance } from '../api/apiInstance';

export const getContractById = async (contractId: string) => {
  try {
    const response = await apiInstance.get(`/contract/${contractId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error fetching contract!');
  }
};
