import { LoginRequest, RegisterRequest } from '../../interfaces/auth';
import { apiInstance } from '../api/apiInstance';

export const login = async (login: LoginRequest): Promise<any> => {
  try {
    console.log('baseURL =', apiInstance.defaults.baseURL);
    const response = await apiInstance.post('/Authen/login', login);
    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      return {
        error: true,
        message: response.data.message ?? 'Login failed',
      };
    }
  } catch (error: any) {
    const message = error.response?.data?.message || error.response?.data?.error || 'Login Failure';

    return {
      error: true,
      message,
    };
  }
};

export const register = async (register: RegisterRequest): Promise<any> => {
  try {
    const response = await apiInstance.post('/Authen/register', register);
    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Register failed');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Register Failure';

    throw new Error(message);
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await apiInstance.post('/Authen/request-password-reset/mobile', { email });
    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Forget Password error');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Register Failure';

    throw new Error(message);
  }
};
