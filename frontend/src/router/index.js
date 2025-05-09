import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Feed from '../views/Feed.vue';
import AddItem from '../views/AddItem.vue';
import ItemDetails from '../views/ItemDetails.vue';
import UserProfile from '../views/UserProfile.vue';
import Profile from '../views/Profile.vue';
import EditUserProfile from '../views/EditUserProfile.vue';
import EditItem from '../views/EditItem.vue';
import Chat from '../views/Chat.vue';
import Conversations from '@/views/Conversations.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/feed',
      component: Feed,
    },
    {
      path: '/add',
      component: AddItem,
    },
    {
      path: '/items/:id',
      component: ItemDetails
    },
    {
      path: '/user/:id',
      component: UserProfile  
    },
    {
      path: '/profile',
      component: Profile
    },
    {
      path: '/edit-profile',
      component: EditUserProfile
    },
    {
      path: '/edit-item/:id',
      component: EditItem
    },
    {
      path: '/chat/:id',
      component: Chat
    },
    {
      path: '/conversations',
      component: Conversations
    }    
  ],
})

export default router
