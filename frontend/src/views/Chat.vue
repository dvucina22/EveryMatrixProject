<template>
  <div class="chat-container">
    <h2>Razgovor s {{ receiverName }}</h2>

    <div class="messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.sender_id === user.id ? 'sent' : 'received']"
      >
        <p>{{ msg.content }}</p>
        <small>{{ new Date(msg.created_at).toLocaleString() }}</small>
      </div>
      <div ref="bottomRef"></div>
    </div>

    <form @submit.prevent="sendMessage" class="message-form">
      <input v-model="newMessage" placeholder="Upiši poruku..." />
      <button type="submit">Pošalji</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import api from '../axios';
import socket from '../socket';

const route = useRoute();
const receiverId = parseInt(route.params.id);
const receiverName = ref('Korisnik');
const newMessage = ref('');
const messages = ref([]);
const bottomRef = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    bottomRef.value?.scrollIntoView({ behavior: 'smooth' });
  });
};

const store = useUserStore();
const { user } = storeToRefs(store);

const roomId = [receiverId, user.value.id].sort().join('-');

const fetchMessages = async () => {
  try {
    const res = await api.get(`/messages/${receiverId}`, {
      headers: { Authorization: `Bearer ${store.token}` },
    });
    messages.value = res.data;
    scrollToBottom();
  } catch (err) {
    console.error('Greška prilikom dohvaćanja poruka:', err);
  }
};


const fetchReceiverName = async () => {
  try {
    const res = await api.get(`/users/${receiverId}`, {
      headers: { Authorization: `Bearer ${store.token}` }
    });
    receiverName.value = `${res.data.first_name} ${res.data.last_name}`;
  } catch (err) {
    console.error('Greška kod dohvaćanja imena korisnika:', err);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const content = newMessage.value.trim();

  try {
    const res = await api.post(
      '/messages',
      { receiver_id: receiverId, content },
      { headers: { Authorization: `Bearer ${store.token}` } }
    );

    const savedMessage = res.data;

    socket.sendMessage(roomId, savedMessage);
    messages.value.push(savedMessage);
    newMessage.value = '';
  } catch (err) {
    console.error('Greška prilikom slanja poruke:', err);
  }
};

onMounted(() => {
  if (!user.value?.id) {
    console.error('Korisnik nije učitan!');
    return;
  }

  fetchMessages();
  fetchReceiverName();

  socket.joinRoom(roomId);

  socket.onNewMessage((msg) => {
    const involved = [msg.sender_id, msg.receiver_id];
    const isForThisChat =
      involved.includes(user.value.id) && involved.includes(receiverId);

    const isMyMessage = msg.sender_id === user.value.id;

    if (isForThisChat && !isMyMessage) {
      messages.value.push(msg);
    }
  });

});

watch(messages, () => {
  scrollToBottom();
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>


<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  color: #333;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
}

h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
}

.message {
  padding: 12px 16px;
  border-radius: 18px;
  margin-bottom: 15px;
  max-width: 75%;
  position: relative;
  line-height: 1.5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message p {
  margin: 0 0 5px;
}

.message small {
  font-size: 0.7rem;
  opacity: 0.7;
  display: block;
}

.sent {
  background-color: #4a90e2;
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.received {
  background-color: #e9ecef;
  color: #333;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}

.message-form {
  display: flex;
  gap: 10px;
  padding: 15px 0 0;
}

.message-form input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #dde1e7;
  border-radius: 24px;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.message-form input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.15);
}

.message-form button {
  padding: 12px 25px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(74, 144, 226, 0.3);
}

.message-form button:hover {
  background-color: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.4);
}

.message-form button:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(74, 144, 226, 0.3);
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  animation: messageIn 0.3s ease-out forwards;
}

@media (max-width: 768px) {
  .chat-container {
    padding: 15px;
    height: calc(100vh - 60px);
    border-radius: 0;
    box-shadow: none;
  }
  
  h2 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
  
  .messages {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .message {
    padding: 10px 14px;
    max-width: 85%;
  }
  
  .message-form input {
    padding: 10px 15px;
  }
  
  .message-form button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>