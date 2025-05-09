<template>
    <div class="loginPage">
        <h1 class="mainTitle">Welcome to Facebook Copy</h1>
        <h1 class="loginTitle">Login</h1>
        <Form :buttonText="'Login'" :submitAction="login"></Form>
        <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useUserStore } from '../stores/user';
  import Form from '../components/Form.vue';
  
  export default {
    components: {
      Form
    },
    methods: {
    async login({ email, password }) {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            const userStore = useUserStore();
            userStore.setUser(response.data);
            this.$router.push('/feed');
        } catch (error) {
            console.error('Login failed:', error);
        }
    }
    }
  };
  </script>
  