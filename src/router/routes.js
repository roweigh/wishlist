const routes = [
  {
    name: 'wishlist',
    path: '/wishlist',
    meta: { title: 'Wishlist' },
    component: () => import('@/views/WishlistView.vue'),
  },
  {
    name: 'overview',
    path: '/overview',
    meta: { title: 'Overview' },
    component: () => import('@/views/OverviewView.vue'),
  },
];

export default routes;