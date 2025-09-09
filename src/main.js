/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
import '@/styles/settings.scss'

// Composables
import { createApp, ref, reactive, computed, onMounted, watch } from 'vue'

window.ref = ref;
window.reactive = reactive;
window.computed = computed;
window.onMounted = onMounted;
window.watch = watch;

// export const bus = new Vue()

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
