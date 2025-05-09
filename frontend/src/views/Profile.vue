<template>
  <div class="user-profile-view">
    <div class="profile-header">
      <h1>Moj profil</h1>
      <p class="subtitle">Pregledajte i uredite vaše osobne podatke</p>
    </div>
    
    <div v-if="user" class="profile-container">
      <div class="profile-image-section">
        <div class="profile-image-wrapper">
          <img 
            v-if="user.profile_picture" 
            :src="`https://node-backend-production-d779.up.railway.app${user.profile_picture}`" 
            alt="Profilna slika" 
            class="profile-image"
          />
          <div v-else class="profile-placeholder">
            {{ getInitials(user) }}
          </div>
        </div>
        <RouterLink :to="`/edit-profile`" class="edit-button">
          <i class="edit-icon">✏️</i>
          Uredi profil
        </RouterLink>
      </div>
      
      <div class="profile-details">
        <div class="info-card">
          <h2>Osobni podaci</h2>
          <div class="info-row">
            <div class="info-label">Ime</div>
            <div class="info-value">{{ user.first_name }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Prezime</div>
            <div class="info-value">{{ user.last_name }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email</div>
            <div class="info-value">{{ user.email }}</div>
          </div>
        </div>
        
        <div class="info-card">
          <h2>Kontakt informacije</h2>
          <div class="info-row">
            <div class="info-label">Telefon</div>
            <div class="info-value">{{ user.phone || 'Nije uneseno' }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Adresa</div>
            <div class="info-value">{{ user.address || 'Nije uneseno' }}</div>
          </div>
        </div>
        
        <div class="info-card">
          <h2>O meni</h2>
          <div class="bio-content">
            {{ user.bio || 'Nema opisa' }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-message">
      <div class="spinner"></div>
      <p>Učitavanje profila...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '../axios';
import { RouterLink } from 'vue-router';

const user = ref(null);

const getInitials = (user) => {
  if (!user) return '';
  return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await api.get(`/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    user.value = res.data;
  } catch (err) {
    console.error('Greška kod učitavanja profila:', err);
  }
});
</script>

<style scoped>
.user-profile-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-top: 0;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px;
}

.profile-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.profile-image-wrapper {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-placeholder {
  width: 100%;
  height: 100%;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
}

.edit-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
}

.edit-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
}

.edit-icon {
  font-style: normal;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.info-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.info-card h2 {
  font-size: 1.3rem;
  color: #007bff;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e5eb;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
}

.info-row:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.info-label {
  flex: 0 0 120px;
  font-weight: 600;
  color: #666;
}

.info-value {
  flex: 1;
  color: #333;
}

.bio-content {
  line-height: 1.6;
  color: #444;
  white-space: pre-line;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #007bff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .profile-container {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .profile-image-section {
    flex: 0 0 220px;
  }
  
  .profile-details {
    width: 450px;
    flex: 1;
  }
}

@media (max-width: 767px) {
  .profile-header h1 {
    font-size: 2rem;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label {
    margin-bottom: 5px;
  }
}
</style>