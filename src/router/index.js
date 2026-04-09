import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Conflicts from '../views/Conflict.vue';
import ConflictDetail from '../views/ConflictDetail.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/conflicts',
      name: 'conflicts',
      component: Conflicts
    },
        {
            path: "/conflicts/:id",
            name: "conflict-detail",
            component: ConflictDetail
        }
  ]
});

export default router;
