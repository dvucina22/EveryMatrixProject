<template>
    <div v-if="visible" class="toast">{{ message }}</div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const message = ref('');
  const visible = ref(false);
  
  function show(msg, duration = 3000) {
    message.value = msg;
    visible.value = true;
    setTimeout(() => visible.value = false, duration);
  }
  
  defineExpose({ show });
  </script>
  
  <style scoped>
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #323232;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    z-index: 1000;
  }
  </style>
  