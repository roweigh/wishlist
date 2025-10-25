import routes from './routes.js';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach(async(to, from, next) => {
  next();
});

export default router;