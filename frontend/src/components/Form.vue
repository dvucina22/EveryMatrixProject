<template>
    <div>
      <form class="formRegLog" @submit.prevent="handleSubmit">
        <div v-if="isRegister">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="firstName" required />
        </div>
  
        <div v-if="isRegister">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="lastName" required />
        </div>
  
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
  
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
  
        <div v-if="isRegister">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
  
        <button type="submit">{{ buttonText }}</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Form',
    props: {
      buttonText: {
        type: String,
        default: 'Pošaljite'
      },
      submitAction: {
        type: Function,
        required: true
      },
      isRegister: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      };
    },
    methods: {
      handleSubmit() {
        if (this.isRegister && this.password !== this.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
  
        const payload = {
          email: this.email,
          password: this.password
        };
  
        if (this.isRegister) {
          payload.firstName = this.firstName;
          payload.lastName = this.lastName;
        }
  
        this.submitAction(payload);
      }
    }
  };
  </script>
  