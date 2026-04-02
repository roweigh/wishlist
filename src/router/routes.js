const routes = [
  {
    name: 'dashboard',
    path: '/dashboard',
    icon: 'mdi-view-grid-outline',
    meta: { title: 'Dashboard' },
    component: () => import('@/views/DashboardView.vue'),
  },
  {
    name: 'Purchases',
    path: '/purchases',
    icon: 'mdi-currency-usd',
    meta: { title: 'Purchases' },
    component: () => import('@/views/WishlistView.vue'),
  },
  {
    path: '/',
    redirect: 'dashboard',
  },
];

export default routes;