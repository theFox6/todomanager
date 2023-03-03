import App from './App.vue'
import { createApp } from "vue";
import store from './store/store.js'
import icons from "./icons.js"

icons.init()
store.commit('initialize')
store.dispatch('update').catch((e) => console.error(e))

const app = createApp(App)
icons.component(app)
app.use(store)
app.mount('#todoapp')
