<template>
    <div class="loginPage">
      <h1 class="mainTitle">Welcome to Facebook Copy</h1>
      <h1 class="loginTitle">Register</h1>
      <Form :buttonText="'Register'" :submitAction="register" :isRegister="true"></Form>
      <p>Already have an account? <router-link to="/login">Login</router-link></p>
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
      async register({ email, password, firstName, lastName }) {
        try {
          const response = await axios.post('https://node-backend-production-d779.up.railway.app/auth/register', {
            email,
            password,
            firstName,
            lastName
          });
          const userStore = useUserStore();
          userStore.setUser(response.data);
          this.$router.push('/feed');
        } catch (error) {
          console.error('Registration failed:', error);
        }
      }
    }
  };
  </script>
  