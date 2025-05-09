<template>
    <div class="user-profile">
      <h1>Oglasi korisnika: {{ user?.first_name }} {{ user?.last_name }}</h1>
      <div class="items-grid">
        <ItemCard v-for="item in items" :key="item.id" :item="item" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import ItemCard from '../components/ItemCard.vue';
  import api from '../axios';
  
  const route = useRoute();
  const userId = route.params.id;
  const items = ref([]);
  const user = ref(null);
  
  onMounted(async () => {
    try {
        const resUser = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
     });
      user.value = resUser.data;

      const resItems = await api.get(`/items/user/${userId}`);
      console.log('Odgovor sa /items/user/:id:', resItems.data);

      items.value = resItems.data.rows.map(item => ({
        ...item,
        image: item.image ? `https://node-backend-production-d779.up.railway.app/uploads/${item.image}` : null
    }));

      console.log('Items:', items.value);  

  
    } catch (err) {
      console.error('Error:', err);
    }
  });
  </script>
  