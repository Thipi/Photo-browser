import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/HomePage.vue';
import PhotoDetail from '@/views/PhotoDetail.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },
  { path: '/photo/:id', name: 'PhotoDetail', component: PhotoDetail }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
