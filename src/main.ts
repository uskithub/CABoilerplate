import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from '@views/Home.vue'
import Signin from '@views/Signin.vue'

const routes = [
    { path: '/', component: Home }
    , { path: '/signin', component: Signin }
]

const router = createRouter({
    history: createWebHashHistory()
    , routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
