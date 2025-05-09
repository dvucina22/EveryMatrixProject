<template>
  <div class="feed-page">
    <div class="feed-header">
      <h1>Marketplace</h1>
      <p class="subtitle">Discover amazing products from sellers around the world</p>
    </div>
    
    <p v-if="!user" class="login-message">Please log in to see items.</p>
    
    <div v-else class="feed-content">
      <div class="welcome-bar">
        <p>Welcome, <span>{{ user.first_name }} {{ user.last_name }}</span></p>
      </div>
      
      <div class="filters-container">
        <div class="search-bar">
          <i class="search-icon">🔍</i>
          <input 
            v-model="searchQuery" 
            placeholder="Search by title..." 
            class="search-input"
          />
        </div>
        
        <div class="filters">
          <div class="filter-group">
            <label>Category</label>
            <select v-model="selectedCategory" class="filter-select">
              <option value="">All categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Min price (€)</label>
            <input type="number" v-model.number="minPrice" class="filter-input" />
          </div>
          
          <div class="filter-group">
            <label>Max price (€)</label>
            <input type="number" v-model.number="maxPrice" class="filter-input" />
          </div>
          
          <button @click="resetFilters" class="reset-button">
            Reset filters
          </button>
        </div>
      </div>
      
      <div class="results-info">
        <p>Showing {{ filteredItems.length }} items</p>
      </div>
      
      <div v-if="filteredItems.length === 0" class="no-results">
        <p>No items match your current filters</p>
        <button @click="resetFilters" class="reset-button">Reset all filters</button>
      </div>
      
      <div v-else class="items-grid">
        <ItemCard 
          v-for="item in filteredItems" 
          :key="item.id" 
          :item="itemWithImageUrl(item)" 
          @click="goToDetails(item.id)"
        />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../axios';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import ItemCard from '../components/ItemCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useUserStore();
const { user } = storeToRefs(store);
const items = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const minPrice = ref(null);
const maxPrice = ref(null);

const categories = ['Elektronika', 'Odjeća', 'Knjige', 'Auti', 'Ostalo'];

const itemWithImageUrl = (item) => {
  if (!item.image) return item;
  return {
    ...item,
    image: `${item.image}`
  };
};

const goToDetails = (id) => {
  router.push(`/items/${id}`);
};

onMounted(async () => {
  if (user.value) {
    try {
      const res = await api.get('/items', {
        headers: { Authorization: `Bearer ${store.token}` }
      });
      items.value = res.data;
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  }
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  minPrice.value = null;
  maxPrice.value = null;
};

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value ? item.category === selectedCategory.value : true;
    const matchesMinPrice = minPrice.value != null ? item.price >= minPrice.value : true;
    const matchesMaxPrice = maxPrice.value != null ? item.price <= maxPrice.value : true;

    return matchesTitle && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });
});
</script>
  
<style scoped>
.feed-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.feed-header {
  text-align: center;
  margin-bottom: 30px;
}

.feed-header h1 {
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

.login-message {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  padding: 3rem;
  background-color: #f1f5f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.welcome-bar {
  background-color: #e6f3ff;
  border-radius: 8px;
  padding: 15px 25px;
  margin-bottom: 25px;
}

.welcome-bar p {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.welcome-bar span {
  font-weight: 600;
  color: #007bff;
}

.filters-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}

.search-bar {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-style: normal;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 1px solid #e1e5eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4da3ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 180px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
}

.filter-select, .filter-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e1e5eb;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: #fff;
  transition: all 0.2s ease;
}

.filter-select:focus, .filter-input:focus {
  outline: none;
  border-color: #4da3ff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.reset-button {
  padding: 10px 20px;
  background-color: #f8f9fa;
  color: #555;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background-color: #e9ecef;
  color: #333;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 5px;
}

.results-info p {
  margin: 0;
  font-size: 0.95rem;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-top: 20px;
}

.no-results p {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 20px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .feed-header h1 {
    font-size: 2rem;
  }
  
  .filters-container {
    padding: 15px;
  }
  
  .items-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>