import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPen, faXmark, faTrash, faCheck,
    faFire, faPersonRunning, faPersonWalking, faHourglass,
    faBagShopping, faPersonDigging, faMountain, faAppleWhole,
    faClipboardList, faHammer, faMagnifyingGlass, faScrewdriverWrench,
    faBoxArchive, faAngleUp, faAngleDown,
    faCalendarDay, faCalendarPlus, faCalendarXmark, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons'

export default {
    init() {
        library.add(
            faPen, faXmark, faTrash, faCheck,
            faFire, faPersonRunning, faPersonWalking, faHourglass,
            faBagShopping, faPersonDigging, faMountain, faAppleWhole,
            faClipboardList, faHammer, faMagnifyingGlass, faScrewdriverWrench,
            faBoxArchive, faAngleUp, faAngleDown,
            faCalendarDay, faCalendarPlus, faCalendarXmark, faExclamationCircle
        )
    },
    component(app) {
        app.component("FontAwesomeIcon", FontAwesomeIcon)
    }
}