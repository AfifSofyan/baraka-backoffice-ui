/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import axios from 'axios'
import { MotionPlugin } from '@vueuse/motion';

  router.beforeEach((to, from, next) => {
    if (to.name === 'NotAuthorizedPage' && from.name === 'Login') {
      next(false);
    } else {
      next();
    }
  });


export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(MotionPlugin)

  // Set up Axios interceptor
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 403) {
        router.push({ name: 'ForbiddenPage' });
      }
      else if (error.response && error.response.status === 401) {
        router.push({ name: 'NotAuthorizedPage' });
      }
      return Promise.reject(error);
    }
  );

  // Inject Axios into Vue instance prototype
  app.config.globalProperties.$axios = axios;
}
