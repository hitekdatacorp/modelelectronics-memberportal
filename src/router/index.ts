import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth-store';
//import { myAppReference } from '@/main';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    //   meta: {
    //     title: 'Home Page',
    //     metaTags: [
    //       {
    //         name: 'Dealer Login Page',
    //         content: ''
    //       }
    //     ]
    //   }
    // },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: 'Dealer Login',
        metaTags: [
          {
            name: 'Dealer Login Page',
            content: 'The login page for customer dealers.'
          }
        ]
      }
    },
    {
      path: '/changepassword',
      name: 'changepassword',
      component: () => import('../views/ChangePasswordView.vue'),
      meta: {
        title: 'Change Password',
        metaTags: [
          {
            name: 'Change Password Form',
            content: 'The form/view for the user to change their password.'
          }
        ]
      }
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
      path: '/partstatus',
      name: 'partstatus',
      // route level code-splitting
      // this generates a separate chunk (NissanPartStatusView.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/NissanPartStatusView.vue'),
      meta: {
        title: 'Part Status',
        metaTags: [
          {
            name: 'Parts Status',
            content: 'Shows the status of all nissan parts that are on back order.'
          }
        ]
      },      
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
      path: '/advexchange',
      name: 'advancedexchange',
      component: () => import('../views/AdvancedExchangeView.vue'),
      meta: {
        title: 'Advanced Exchange',
        metaTags: [
          {
            name: 'Advanced Exchange',
            content: 'Check stock and perform advanced exchanges.'
          }
        ]
      },
      children: [
        {
          // checkstock will be rendered inside AdvancedExchange <router-view>
          // when /advexchange is matched
          path: '',
          name: 'checkstock1',
          props: false,
          component: () => import('../views/CheckStockView.vue')
        },
        {
          // order will be rendered inside AdvancedExchange <router-view>
          // when /advexchange/order is matched
          path: 'order/:orderType/:partNumber',
          name: 'orderex',
          props: route => ({
            orderType: route.params.orderType,
            partNumber: route.params.partNumber,
            isWarrantyExchange: route.query.isWarrantyExchange === 'true'
          }),
          component: () => import('../views/OrderView.vue'),
          children: [
            
              {
                path: 'confirm/:orderId',
                name: 'orderconfirm1',
                props: true,
                component: () => import('../views/OrderConfirmationView.vue'),
                meta: {
                  title: 'Order Confirmation',
                  metaTags: [
                    {
                      name: 'Order Confirmation',
                      content: 'Your order confirmation number and info.'
                    }
                  ]
                },
              }
            
          ]
        }]
    },
    // {
    //   path: '/outrightpurchase',
    //   name: 'outrightpurchase',
    //   component: () => import('../views/OutrightPurchaseView.vue'),
    //   meta: {
    //     title: 'Outright Purchase',
    //     metaTags: [
    //       {
    //         name: 'Outright Purchase',
    //         content: 'Purchase a part outright for the full price with no part exchange'
    //       }
    //     ]
    //   },
    //   children: [
    //     {
    //       // checkstock will be rendered inside OutrightPurchase <router-view>
    //       // when /outrightpurchase/checkstock is matched
    //       path: '',
    //       name: 'checkstock2',
    //       props: false,
    //       component: () => import('../views/CheckStockView.vue')
    //     },
    //     {
    //       path: 'order/:orderType/:partNumber',
    //       name: 'orderpurch',
    //       props: true,
    //       component: () => import('../views/OrderView.vue'),
    //       children: [
            
    //         {
    //           path: 'confirm/:orderId',
    //           name: 'orderconfirm2',
    //           props: true,
    //           component: () => import('../views/OrderConfirmationView.vue'),
    //           meta: {
    //             title: 'Order Confirmation',
    //             metaTags: [
    //               {
    //                 name: 'Order Confirmation',
    //                 content: 'Your order confirmation number and info.'
    //               }
    //             ]
    //           },
    //         }
          
    //     ]
    //     }]
    // },

    {
      path: '/nissandownloads',
      name: 'Downloads',
      component: () => import('../views/NissanDownloadsView.vue'),
      meta: {
        title: 'Downloads',
        metaTags: [
          {
            name: 'Downloads',
            content: 'Download various forms.'
          }
        ]
      },      
    },
    {
      path: '/speedometer',
      name: 'speedometer',
      component: () => import('../views/SpeedometerView.vue'),
      meta: {
        title: 'Speedometer',
        metaTags: [
          {
            name: 'Speedometer',
            content: 'Check stock and perform exchanges for nissan dealers.'
          }
        ]
      },      
      children: [
        {        
          path: '',
          name: 'checkstocknissan',
          props: false,
          component: () => import('../views/CheckStockView.vue')
        },
        {       
          path: 'order/:orderType/:partNumber',
          name: 'ordernissan',
          props: true,
          component: () => import('../views/OrderNissanView.vue'),
          children: [            
              {
                path: 'confirm/:orderId',
                name: 'orderconfirmnissan',
                props: true,
                component: () => import('../views/OrderConfirmationView.vue'),
                meta: {
                  title: 'Order Confirmation',
                  metaTags: [
                    {
                      name: 'Order Confirmation',
                      content: 'Your order confirmation number and info.'
                    }
                  ]
                },
              }
            
          ]
        }]
    },

    {
      path: '/invoicehist',
      name: 'invoicehistory',
      component: () => import('../views/InvoiceHistoryView.vue'),
      meta: {
        title: 'Invoice Copies',
        metaTags: [
          {
            name: 'Invoice Copies',
            content: 'View invoice history for sales and exchanges including tracking information'
          }
        ]
      },
    },
   
    {
      path: '/repairform',
      name: 'repairform',
      component: () => import('../views/RepairFormView.vue'),
      meta: {
        title: 'Repair Form',
        metaTags: [
          {
            name: 'Repair Form',
            content: 'Fill out a repair form.'
          }
        ]
      },
    },
    {
      path: '/radiosurvey/:orderId?',
      name: 'radiosurvey',
      props: true,
      component: () => import('../views/RadioSurveyView.vue'),
      meta: {
        title: 'Radio Survey',
        metaTags: [
          {
            name: 'Radio Survey',
            content: 'Fill out a radio survey.'
          }
        ]
      },
    },
    {
      path: '/clustersurvey/:orderId?',
      name: 'clustersurvey',
      props: true,
      component: () => import('../views/ClusterSurveyView.vue'),
      meta: {
        title: 'Cluster Survey',
        metaTags: [
          {
            name: 'Cluster Survey',
            content: 'Fill out a cluster survey.'
          }
        ]
      },
    },   
  ]
});

router.beforeEach(async (to) => {

  //myAppReference.config.globalProperties.$Progress.start();

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/', '/about'];

  const authRequired = !publicPages.includes(to.path);
  const authStore = useAuthStore();
  if (authRequired && (!authStore.profile || !authStore.profile.token)) {
    authStore.setReturnUrl(to.fullPath);
    return '/';
  }

  const nissanPages = ['/partstatus', '/nissandownloads', '/speedometer'];
  const gmOrOtherPages = ['/clustersurvey', '/radiosurvey', '/repairform', '/advexchange'];

  // do not let GM or Other dealers access nissan pages
  // if(authStore.isGMOrOtherDealer && nissanPages.includes(to.path)) {
  //   return '/advexchange';
  // }

  // // do not let Nissan dealers access GM or Other pages
  // if(authStore.isNissanDealer && gmOrOtherPages.includes(to.path)) {
  //   return '/speedometer';
  // }
});

router.afterEach(async (to, from) => {
  //myAppReference.config.globalProperties.$Progress.finish();
});

export default router
