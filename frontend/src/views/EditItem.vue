<template>
    <div class="edit-item-page">
      <div class="edit-item-container">
        <div class="form-header">
          <h2>Edit Listing</h2>
          <p>Update the details of your listing</p>
        </div>
        
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading item details...</p>
        </div>
        
        <form v-else @submit.prevent="submit" class="item-form">
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
            <label for="image">Update Image (Optional)</label>
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
                <span class="file-text">{{ image ? image.name : 'Choose a new image file' }}</span>
              </div>
            </div>
            <p class="file-help">Leave empty to keep current image</p>
          </div>
          
          <div class="action-buttons">
            <button type="button" class="cancel-btn" @click="goBack">Cancel</button>
            <button type="submit" class="submit-btn">
              <span class="btn-icon">✓</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import api from '../axios';
  import { useUserStore } from '../stores/user';
  
  const store = useUserStore();
  const route = useRoute();
  const router = useRouter();
  
  const title = ref('');
  const description = ref('');
  const price = ref(0);
  const image = ref(null);
  const category = ref('');
  const country = ref('');
  const city = ref('');
  const loading = ref(true);
  const categories = ['Elektronika', 'Odjeća', 'Knjige', 'Auti', 'Ostalo'];
  
  const onFileChange = (e) => {
    image.value = e.target.files[0];
  };
  
  const goBack = () => {
    router.back();
  };
  
  onMounted(async () => {
    try {
      const res = await api.get(`/items/${route.params.id}`);
      const item = res.data;
      
      if (store.user.id !== item.user_id) {
        router.push('/feed');
        return;
      }
      
      title.value = item.title;
      description.value = item.description;
      price.value = item.price;
      category.value = item.category;
      country.value = item.country;
      city.value = item.city;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  });
  
  const submit = async () => {
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('price', price.value);
    formData.append('category', category.value);
    formData.append('country', country.value);
    formData.append('city', city.value);
    if (image.value) formData.append('image', image.value);
  
    try {
      await api.put(`/items/${route.params.id}`, formData, {
        headers: {
          Authorization: `Bearer ${store.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      router.push(`/items/${route.params.id}`);
    } catch (err) {
      console.error(err);
      alert('Error saving changes.');
    }
  };
  </script>
  
  <style scoped>
  .edit-item-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .edit-item-container {
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
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  
  .action-buttons {
    display: flex;
    gap: 15px;
    margin-top: 10px;
  }
  
  .submit-btn, .cancel-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .submit-btn {
    background-color: #007bff;
    color: white;
    flex: 2;
  }
  
  .submit-btn:hover {
    background-color: #0069d9;
    transform: translateY(-1px);
  }
  
  .cancel-btn {
    background-color: #f8f9fa;
    color: #555;
    border: 1px solid #dee2e6;
    flex: 1;
  }
  
  .cancel-btn:hover {
    background-color: #e9ecef;
    color: #333;
  }
  
  .btn-icon {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    .edit-item-container {
      padding: 20px;
    }
    
    .form-row {
      flex-direction: column;
      gap: 20px;
    }
  }
  
  @media (max-width: 480px) {
    .edit-item-page {
      padding: 10px;
    }
    
    .edit-item-container {
      padding: 15px;
      border-radius: 8px;
    }
    
    .form-header h2 {
      font-size: 1.5rem;
    }
    
    .action-buttons {
      flex-direction: column;
    }
  }
  </style>