<template>
    <div class="conversations">
      <h2>Tvoji razgovori</h2>
      <div v-if="users.length === 0">Nemaš nijedan razgovor još.</div>
      <ul>
        <li v-for="user in users" :key="user.id" @click="goToChat(user.id)">
          {{ user.first_name }} {{ user.last_name }} ({{ user.email }})
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '../stores/user';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import api from '../axios';
  
  const users = ref([]);
  const router = useRouter();
  
  const store = useUserStore();
  const { user } = storeToRefs(store);
  
  onMounted(async () => {
    try {
      const res = await api.get('/messages/conversations', {
        headers: { Authorization: `Bearer ${store.token}` }
      });
      users.value = res.data;
    } catch (err) {
      console.error('Greška kod dohvaćanja razgovora:', err);
    }
  });
  
  const goToChat = (id) => {
    router.push(`/chat/${id}`);
  };
  </script>
  
  <style scoped>
  .conversations {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    color: #333;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e9ecef;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    padding: 15px 20px;
    margin-bottom: 12px;
    border-radius: 8px;
    background-color: #f8f9fa;
    border-left: 4px solid #4a90e2;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  li:hover {
    background-color: #e9f2ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  li:before {
    content: '';
    display: inline-block;
    width: 36px;
    height: 36px;
    margin-right: 15px;
    background-color: #4a90e2;
    border-radius: 50%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'%3E%3C/path%3E%3C/svg%3E");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  @media (max-width: 768px) {
    .conversations {
      padding: 20px;
      border-radius: 0;
      box-shadow: none;
    }
    
    h2 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      padding-bottom: 10px;
    }
    
    li {
      padding: 12px 15px;
      margin-bottom: 8px;
    }
    
    li:before {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      background-size: 16px;
    }
  }
  
  div:not(h2) + div {
    padding: 30px;
    text-align: center;
    background-color: #f8f9fa;
    border-radius: 8px;
    color: #6c757d;
    font-size: 1.1rem;
  }
  </style>