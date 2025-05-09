<template>
  <div class="item-details-page">
    <div v-if="item" class="item-details-container">
      <div class="item-gallery">
        <div class="image-wrapper">
          <img
            v-if="item.image"
            :src="`http://localhost:5000/uploads/${item.image}`"
            alt="Item image"
            class="item-image"
          />
          <div v-else class="no-image">
            <span class="no-image-icon">📷</span>
            <span>No image available</span>
          </div>
        </div>
      </div>

      <div class="item-content">
        <div class="item-header">
          <h1>{{ item.title }}</h1>
          <div class="item-category">{{ item.category }}</div>
        </div>

        <div class="item-pricing">
          <div class="price">{{ item.price }} €</div>
          <div class="expiration">
            <span class="expiration-label">Listing expires:</span>
            <span class="expiration-date">{{ formatDate(item.expiration_date) }}</span>
          </div>
        </div>

        <div class="item-location">
          <i class="location-icon">📍</i>
          <span>{{ item.city }}, {{ item.country }}</span>
        </div>

        <div class="item-description">
          <h2>Description</h2>
          <p>{{ item.description }}</p>
        </div>

        <div class="seller-card">
          <h2>Seller Information</h2>
          <div class="seller-info">
            <div class="seller-avatar">
              <span>{{ getInitials(item.first_name, item.last_name) }}</span>
            </div>
            <div class="seller-details">
              <router-link :to="`/user/${item.user_id}`" class="seller-name">
                {{ item.first_name }} {{ item.last_name }}
              </router-link>
              <div class="seller-email">{{ item.email }}</div>
              <router-link :to="`/chat/${item.user_id}`"><button class="contact-btn">Contact Seller</button></router-link>
            </div>
          </div>
        </div>

        <div v-if="store.user.id === item.user_id" class="item-actions">
          <router-link :to="`/edit-item/${item.id}`" class="edit-btn">
            <span class="btn-icon">✏️</span>
            Edit Listing
          </router-link>
          <button @click="confirmDelete" class="delete-btn">
            <span class="btn-icon">🗑️</span>
            Delete Listing
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading item details...</p>
    </div>

    <div v-if="showDeleteModal" class="modal-backdrop" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <h3>Delete Listing</h3>
        <p>Are you sure you want to delete this listing? This action cannot be undone.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
          <button class="confirm-delete-btn" @click="deleteItem">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const store = useUserStore();
const router = useRouter();
const route = useRoute();
const item = ref(null);
const showDeleteModal = ref(false);

onMounted(async () => {
  try {
    const res = await api.get(`/items/${route.params.id}`);
    item.value = res.data;
  } catch (err) {
    console.error(err);
  }
});

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteItem = async () => {
  try {
    await api.delete(`/items/${route.params.id}`, {
      headers: { Authorization: `Bearer ${store.token}` }
    });
    router.push('/feed');
  } catch (err) {
    console.error(err);
    alert('Error deleting listing.');
  } finally {
    showDeleteModal.value = false;
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('hr-HR', options);
};

const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;
};
</script>

<style scoped>
.item-details-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.item-details-container {
  display: flex;
  gap: 40px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.item-gallery {
  flex: 1;
  min-width: 40%;
  background-color: #f8f9fa;
}

.image-wrapper {
  height: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #adb5bd;
  font-size: 1rem;
  gap: 10px;
}

.no-image-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.item-content {
  flex: 1.5;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.item-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  flex: 1;
}

.item-category {
  background-color: #007bff;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.item-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.price {
  font-size: 2.2rem;
  font-weight: 700;
  color: #007bff;
}

.expiration {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

</style>