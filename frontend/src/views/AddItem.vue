<template>
  <div class="add-item-page">
    <div class="add-item-container">
      <div class="form-header">
        <h2>Add New Listing</h2>
        <p>Fill in the details below to create your listing</p>
      </div>
      
      <form @submit.prevent="submit" class="item-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            id="title"
            v-model="title" 
            placeholder="Enter a descriptive title" 
            type="text" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            v-model="description" 
            placeholder="Describe your item with details about condition, features, etc." 
            required
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="price">Price</label>
            <div class="price-input">
              <input 
                id="price"
                v-model.number="price" 
                placeholder="0.00" 
                type="number" 
                min="0" 
                step="0.01" 
                required 
              />
              <span class="currency">€</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" v-model="category" required>
              <option disabled value="">Select category</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="country">Country</label>
            <input 
              id="country"
              v-model="country" 
              placeholder="Enter country" 
              type="text" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="city">City</label>
            <input 
              id="city"
              v-model="city" 
              placeholder="Enter city or area" 
              type="text" 
              required 
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="image">Item Image</label>
          <div class="file-input-container">
            <input 
              id="image"
              type="file" 
              @change="onFileChange" 
              accept="image/*"
              class="file-input"
            />
            <div class="file-input-label">
              <span class="file-icon">📷</span>
              <span class="file-text">{{ image ? image.name : 'Choose an image file' }}</span>
            </div>
          </div>
          <p class="file-help">High-quality images increase your chances of selling</p>
        </div>
        
        <button type="submit" class="submit-btn">
          <span class="btn-icon">✓</span>
          Publish Listing
        </button>
      </form>
    </div>
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../axios';
import Toast from '../components/Toast.vue';
import { useRouter } from 'vue-router';

const toastRef = ref(null);
const router = useRouter();

import { useUserStore } from '../stores/user';

const title = ref('');
const description = ref('');
const price = ref(0);
const image = ref(null);
const category = ref('');
const categories = ['Elektronika', 'Odjeća', 'Knjige', 'Auti', 'Ostalo'];
const country = ref('');
const city = ref('');

const store = useUserStore();

const onFileChange = (e) => {
  image.value = e.target.files[0];
};

const submit = async () => {
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('description', description.value);
  formData.append('price', price.value);
  formData.append('category', category.value);
  if (image.value) formData.append('image', image.value);
  formData.append('country', country.value);
  formData.append('city', city.value);

  try {
    await api.post('/items', formData, {
      headers: {
        Authorization: `Bearer ${store.token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    toastRef.value.show('Listing published successfully!');
    setTimeout(() => {
      router.push('/feed');
    }, 2000);
  } catch (err) {
    console.error(err);
    toastRef.value.show('Error publishing your listing');
  }
};
</script>

<style scoped>
.add-item-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.add-item-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.form-header p {
  color: #666;
  font-size: 1rem;
}

.item-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
}

input, textarea, select {
  padding: 12px 14px;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #fff;
  color: #333;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #4da3ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.price-input {
  position: relative;
}

.price-input input {
  padding-right: 30px;
}

.price-input .currency {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  color: #666;
  font-weight: 600;
}

.file-input-container {
  position: relative;
  margin-bottom: 5px;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px dashed #ccd0d5;
  border-radius: 6px;
  background-color: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-input-container:hover .file-input-label {
  border-color: #4da3ff;
  background-color: #f0f7ff;
}

.file-icon {
  font-size: 1.2rem;
  color: #007bff;
}

.file-text {
  color: #666;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-help {
  font-size: 0.8rem;
  color: #888;
  margin-top: 5px;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #0069d9;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .add-item-container {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .add-item-page {
    padding: 10px;
  }
  
  .add-item-container {
    padding: 15px;
    border-radius: 8px;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
}
</style>