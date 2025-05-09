import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isNotAuthenticated: (state) => !state.token
  },
  actions: {
    setUser(data) {
      this.user = data.user;
      this.token = data.token;
      localStorage.setItem('token', data.token);
    },
    loadUser() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.user = payload;
        } catch (e) {
          console.error("Neispravan token", e);
          this.user = null;
        }
      }
    },
    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
    }
    
  }
});
