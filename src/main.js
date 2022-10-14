import App from './App.vue'
import { createApp } from "vue";
import store from './store/store.js'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPen, faXmark, faTrash,
    faFire, faPersonRunning, faPersonWalking, faHourglass,
    faBagShopping, faPersonDigging, faMountain, faAppleWhole,
    faBoxArchive, faAngleUp, faAngleDown,
    faCalendarDay, faCalendarPlus, faCalendarXmark, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faPen, faXmark, faTrash,
    faFire, faPersonRunning, faPersonWalking, faHourglass,
    faBagShopping, faPersonDigging, faMountain, faAppleWhole,
    faBoxArchive, faAngleUp, faAngleDown,
    faCalendarDay, faCalendarPlus, faCalendarXmark, faExclamationCircle
)

store.commit('initialize')
const app = createApp(App)
app.component("FontAwesomeIcon", FontAwesomeIcon)
app.use(store)
app.mount('#todoapp')
