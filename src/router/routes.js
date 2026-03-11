const routes = [
  {
    name: 'wishlist',
    path: '/wishlist',
    meta: { title: 'Wishlist' },
    component: () => import('@/views/WishlistView.vue'),
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    meta: { title: 'Dashboard' },
    component: () => import('@/views/DashboardView.vue'),
  },
  {
    path: '/',
    redirect: 'dashboard',
  },
];

export default routes;