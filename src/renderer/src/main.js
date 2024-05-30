import { createApp } from "vue";
import App from '@renderer/App.vue'
import store from '@renderer/store/store.js'
import icons from "@renderer/icons.js"

icons.init()
store.commit('initialize')
//store.dispatch('update').catch((e) => console.error(e))

const app = createApp(App)
icons.component(app)
app.use(store)
app.mount('#todoapp')
