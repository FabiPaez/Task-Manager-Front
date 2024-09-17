import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskList from '../views/TaskList.vue'   // Asegúrate de que la ruta sea correcta
import TaskForm from '../views/TaskForm.vue'   // Asegúrate de que la ruta sea correcta
import TaskHistory from '../views/TaskHistory.vue'   // Asegúrate de que la ruta sea correcta

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/list',
    name: 'list',
    component: TaskList
  },
  {
    path: '/form/:id?',
    name: 'form',
    component: TaskForm
  },
  {
    path: '/tareas/:id?/historial',
    name: 'history',
    component: TaskHistory
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;
