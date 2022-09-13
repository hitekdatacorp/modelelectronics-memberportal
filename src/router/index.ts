import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth-store';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/clients',
      name: 'clients',
      // route level code-splitting
      // this generates a separate chunk (Clients.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ClientsView.vue'),


      children: [
        {
          // ClientEditView will be rendered inside ClientsView <router-view>
          // when /clients/edit/:id is matched
          path: 'edit/:id',
          name: 'clientedit',
          props: true,
          component: () => import('../views/ClientEditView.vue')
        },
        {
          path: 'add/:id',
          name: 'clientadd',
          props: true,
          component: () => import('../views/ClientAddView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/checkstock',
      name: 'checkstock',
      component: () => import('../views/CheckStockView.vue')
    }
  ]
});

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/', '/about'];
  const authRequired = !publicPages.includes(to.path);
  
  const authStore = useAuthStore();
  if (authRequired && (!authStore.profile || !authStore.profile.token)) {
    authStore.setReturnUrl(to.fullPath);
    return '/login';
  }
});

export default router
