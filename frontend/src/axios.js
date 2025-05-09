import axios from 'axios';
import router from './router';
import { useUserStore } from './stores/user';

const api = axios.create({
  baseURL: 'https://node-backend-production-d779.up.railway.app',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const store = useUserStore();
      store.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
