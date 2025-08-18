import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { useCheckInStore } from './stores/checkInStore'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Load check-ins from Supabase when app starts
const checkInStore = useCheckInStore()
checkInStore.loadCheckIns()

app.mount('#app')
