import Constants from 'expo-constants';
import axios from 'axios';

const API_BASE =
  (Constants as any).expoConfig?.extra?.API_BASE ||
  process.env.API_BASE ||
  'http://10.183.12.131:4000';

export const api = axios.create({ baseURL: API_BASE });

export const setToken = (token: string | null) => {
  if (token) {
    (api.defaults.headers as any).common['Authorization'] = `Bearer ${token}`;
  } else {
    delete (api.defaults.headers as any).common['Authorization'];
  }
};
