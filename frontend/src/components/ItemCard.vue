<template>
  <div class="item-card" @click="$emit('click')">
    <div class="item-image">
      <img v-if="item.image" :src="item.image" alt="Item image" />
      <div v-else class="placeholder-image">
        <span>No image</span>
      </div>
      <div class="item-category">{{ item.category }}</div>
    </div>
    <div class="item-details">
      <h3 class="item-title">{{ item.title }}</h3>
      <div class="item-location">
        <i class="location-icon">📍</i>
        <p>{{ item.country }}</p>
      </div>
      <div class="price-section">
        <span class="price-tag">{{ item.price }} €</span>
        <button class="view-details">View details</button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
defineProps({
  item: Object
});
</script>

<style scoped>
.item-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.item-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background-color: #f8f9fa;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .item-image img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #adb5bd;
  font-size: 0.9rem;
}

.item-category {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 123, 255, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.item-details {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  margin: 0 0 10px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
}

.location-icon {
  color: #666;
  font-size: 0.9rem;
  font-style: normal;
}

.item-location p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.price-section {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-tag {
  font-size: 1.1rem;
  font-weight: 700;
  color: #007bff;
}

.view-details {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-details:hover {
  background-color: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .item-title {
    font-size: 1rem;
  }
  
  .price-tag {
    font-size: 1.1rem;
  }
}
</style>