import routes from './routes.js';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory('/wishlist/'),
  routes,
});

router.beforeEach(async(to, from, next) => {
  next();
});

export default router;