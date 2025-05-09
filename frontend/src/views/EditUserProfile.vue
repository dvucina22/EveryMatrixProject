<template>
  <div class="edit-profile-view">
    <div class="edit-header">
      <h1>Uredi profil</h1>
      <p class="subtitle">Ažurirajte svoje osobne podatke</p>
    </div>
    
    <div class="edit-container">
      <form @submit.prevent="submitForm" enctype="multipart/form-data" class="edit-form">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-section">
              <h2>Osobni podaci</h2>
              
              <div class="form-group">
                <label for="first_name">Ime</label>
                <input 
                  id="first_name"
                  v-model="form.first_name" 
                  placeholder="Unesite vaše ime" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="last_name">Prezime</label>
                <input 
                  id="last_name"
                  v-model="form.last_name" 
                  placeholder="Unesite vaše prezime" 
                  required 
                />
              </div>
            </div>
            
            <div class="form-section">
              <h2>Kontakt informacije</h2>
              
              <div class="form-group">
                <label for="phone">Telefon</label>
                <input 
                  id="phone"
                  v-model="form.phone" 
                  placeholder="Unesite vaš telefonski broj" 
                />
              </div>
              
              <div class="form-group">
                <label for="address">Adresa</label>
                <input 
                  id="address"
                  v-model="form.address" 
                  placeholder="Unesite vašu adresu" 
                />
              </div>
            </div>
          </div>
          
          <div class="form-column">
            <div class="form-section">
              <h2>O meni</h2>
              
              <div class="form-group">
                <label for="bio">Opis</label>
                <textarea 
                  id="bio"
                  v-model="form.bio" 
                  placeholder="Napišite nešto o sebi"
                  rows="6"
                ></textarea>
                <div class="form-help">Kratak opis koji će biti vidljiv na vašem profilu</div>
              </div>
            </div>
            
            <div class="form-section">
              <h2>Profilna slika</h2>
              
              <div class="image-preview-container">
                <div v-if="imagePreview || form.profile_picture" class="image-preview">
                  <img 
                    :src="imagePreview || `http://localhost:5000${form.profile_picture}`" 
                    alt="Pregled slike" 
                  />
                </div>
                <div v-else class="image-placeholder">
                  {{ getInitials() }}
                </div>
              </div>
              
              <div class="file-input-container">
                <label for="profile_picture" class="file-input-label">
                  <span class="file-icon">📷</span>
                  <span>{{ profilePictureFile ? profilePictureFile.name : 'Odaberite sliku' }}</span>
                </label>
                <input 
                  id="profile_picture"
                  type="file" 
                  @change="handleFileUpload" 
                  accept="image/*"
                  class="file-input"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <RouterLink to="/profile" class="cancel-button">Odustani</RouterLink>
          <button type="submit" class="save-button">
            <span class="save-icon">💾</span>
            Spremi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../axios';
import { useRouter, RouterLink } from 'vue-router';

const router = useRouter();
const form = ref({
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  bio: '',
  profile_picture: null
});
const profilePictureFile = ref(null);
const imagePreview = ref(null);
const userId = ref(null);
const isLoading = ref(false);

const getInitials = () => {
  if (!form.value.first_name || !form.value.last_name) return '';
  return `${form.value.first_name.charAt(0)}${form.value.last_name.charAt(0)}`.toUpperCase();
};

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    const res = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    Object.assign(form.value, res.data);
    userId.value = res.data.id;
  } catch (err) {
    console.error('Greška kod dohvaćanja korisnika:', err);
  }
});

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  profilePictureFile.value = file;
  
  // Create image preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const submitForm = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  const token = localStorage.getItem('token');
  const formData = new FormData();

  // Add all form fields to formData
  for (const key in form.value) {
    if (key !== 'profile_picture') {
      formData.append(key, form.value[key] || '');
    }
  }

  // Add profile picture file if selected
  if (profilePictureFile.value) {
    formData.append('profile_picture', profilePictureFile.value);
  }

  try {
    await api.put(`/users/${userId.value}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    router.push('/profile');
  } catch (err) {
    console.error('Greška kod spremanja profila:', err);
    alert('Došlo je do greške prilikom spremanja profila. Molimo pokušajte ponovno.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.edit-profile-view {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.edit-header {
  text-align: center;
  margin-bottom: 30px;
}

.edit-header h1 {
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

.edit-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 40px;
}

.edit-form {
  width: 100%;
}

.form-columns {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-section {
  margin-bottom: 30px;
}

.form-section h2 {
  font-size: 1.3rem;
  color: #007bff;
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e5eb;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  background-color: #fff;
}

.form-help {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #777;
}

.image-preview-container {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

.image-preview,
.image-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: bold;
}

.file-input-container {
  margin-top: 15px;
  text-align: center;
}

.file-input {
  display: none;
}

.file-input-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f0f0f0;
  color: #444;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.file-input-label:hover {
  background-color: #ddd;
}

.file-icon {
  font-size: 1.2rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e1e5eb;
}

.cancel-button {
  padding: 12px 25px;
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.cancel-button:hover {
  background-color: #e9e9e9;
}

.save-button {
  padding: 12px 25px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.save-button:hover {
  background-color: #0056b3;
}

.save-icon {
  font-style: normal;
}

@media (min-width: 768px) {
  .form-columns {
    flex-direction: row;
  }
  
  .form-column {
    flex: 1;
    padding: 0 15px;
  }
  
  .form-column:first-child {
    padding-left: 0;
  }
  
  .form-column:last-child {
    padding-right: 0;
  }
}

@media (max-width: 767px) {
  .edit-header h1 {
    font-size: 2rem;
  }
  
  .edit-container {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button,
  .save-button {
    width: 100%;
    justify-content: center;
  }
}
</style>