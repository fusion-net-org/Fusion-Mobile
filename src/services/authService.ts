import { LoginRequest } from '../../interfaces/auth';
import { apiInstance } from '../api/apiInstance';

export const login = async (login: LoginRequest): Promise<any> => {
  try {
    console.log('baseURL =', apiInstance.defaults.baseURL);
    const response = await apiInstance.post('/Authen/login', login);

    console.log(response);

    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error: any) {
    console.error('Login error:', error);

    const message = error.response?.data?.message || error.response?.data?.error || 'Login Failure';

    throw new Error(message);
  }
};
