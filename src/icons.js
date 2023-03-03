import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPen, faXmark, faTrash, faCheck, faGears,
    faFire, faPersonRunning, faPersonWalking, faHourglass,
    faBagShopping, faPersonDigging, faMountain, faAppleWhole,
    faClipboardList, faHammer, faMagnifyingGlass, faScrewdriverWrench,
    faBoxArchive, faFileExport,
    faAngleUp, faAngleDown, faExclamationCircle,
    faCalendarDay, faCalendarPlus, faCalendarXmark
} from '@fortawesome/free-solid-svg-icons'

export default {
    init() {
        library.add(
            faPen, faXmark, faTrash, faCheck, faGears,
            faFire, faPersonRunning, faPersonWalking, faHourglass,
            faBagShopping, faPersonDigging, faMountain, faAppleWhole,
            faClipboardList, faHammer, faMagnifyingGlass, faScrewdriverWrench,
            faBoxArchive, faFileExport,
            faAngleUp, faAngleDown, faExclamationCircle,
            faCalendarDay, faCalendarPlus, faCalendarXmark
        )
    },
    component(app) {
        app.component("FontAwesomeIcon", FontAwesomeIcon)
    }
}