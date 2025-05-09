<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useUserStore } from './stores/user';
import { computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import api from './axios';

const router = useRouter();
const store = useUserStore();
store.loadUser();

const user = reactive({
  first_name: '',
  last_name: '',
  profile_picture: '',
});

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await api.get(`/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    Object.assign(user, res.data); 
  } catch (err) {
    console.error('Greška kod učitavanja profila:', err);
  }
});

const isAuthenticated = computed(() => store.isAuthenticated);
const isNotAuthenticated = computed(() => store.isNotAuthenticated);

function logout() {
  store.logout();
  router.push('/login');
}
</script>

<template>
  <div class="app-container">
    <header>
      <div class="wrapper">
        <div class="logo">
          <img src="./assets/logo.png" alt="Logo" />
          <h1>Sellr</h1>
        </div>
        <nav>
          <RouterLink v-if="isAuthenticated" to="/feed">Marketplace</RouterLink>
          <RouterLink v-if="isAuthenticated" to="/add">Add Item</RouterLink>
          <RouterLink v-if="isAuthenticated" to="/conversations">Chats</RouterLink>
          <RouterLink v-if="isNotAuthenticated" to="/login">Login</RouterLink>
          <RouterLink v-if="isNotAuthenticated" to="/register">Register</RouterLink>
          <a v-if="isAuthenticated" href="/login" @click.prevent="logout" class="logout-btn">Logout</a>
        </nav>
        <div class="profile" v-if="isAuthenticated">
          <RouterLink to="/profile" class="profile-link">
            <div class="profile-info">
              <p>{{ user.first_name }} {{ user.last_name }}</p>
            </div>
            <div class="profile-image">
              <img v-if="user.profile_picture" :src="`http://localhost:5000${user.profile_picture}`" alt="Profile" />
              <div v-else class="no-picture">
                <span>{{ user.first_name?.charAt(0) || '' }}{{ user.last_name?.charAt(0) || '' }}</span>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <div class="footer-content">
        <p>&copy; 2025 Sellr - Your Marketplace Solution</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  color: #333;
}

header {
  background-color: #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  padding: 0.8rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #007bff;
  margin: 0;
}

nav {
  display: flex;
  gap: 1.2rem;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  font-size: 1rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

nav a:hover {
  background-color: #f0f7ff;
  color: #007bff;
}

nav a.router-link-exact-active {
  background-color: #007bff;
  color: #fff;
}

.logout-btn {
  border: 1px solid #dc3545;
  color: #dc3545;
}

.logout-btn:hover {
  background-color: #dc3545;
  color: #fff;
}

.profile {
  margin-left: 20px;
}

.profile-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  padding: 6px 12px;
  border-radius: 24px;
  transition: all 0.2s ease;
}

.profile-link:hover {
  background-color: #f0f7ff;
}

.profile-info p {
  margin: 0;
  font-weight: 500;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-picture {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
}

main {
  flex: 1;
  margin-top: 80px;
  padding-bottom: 50px;
}

footer {
  background-color: #343a40;
  color: #fff;
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

@media (max-width: 1024px) {
  .wrapper {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .wrapper {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }

  .logo {
    margin-right: auto;
  }

  nav {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
    gap: 0.6rem;
  }

  .profile {
    margin-left: 0;
    margin-right: 10px;
  }

  main {
    margin-top: 140px;
  }
}

@media (max-width: 480px) {
  header {
    padding: 0.6rem 1rem;
  }

  .logo h1 {
    font-size: 1.5rem;
  }

  nav {
    flex-wrap: wrap;
  }

  nav a {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .profile-link {
    padding: 4px 8px;
  }

  .profile-image {
    width: 35px;
    height: 35px;
  }

  main {
    margin-top: 180px;
  }
}
</style>