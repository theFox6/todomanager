import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPen, faXmark, faTrash, faCheck, faGears,
    faFire, faPersonRunning, faPersonWalking, faHourglass,
    faBagShopping, faPersonDigging, faMountain, faAppleWhole,
    faClipboardList, faHammer, faMagnifyingGlass, faScrewdriverWrench,
    faBoxArchive, faFileExport, faBoxesStacked,
    faAngleUp, faAngleDown, faExclamationCircle, faArrowUp,
    faCalendarDay, faCalendarPlus, faCalendarXmark,
    faFaceLaughWink, faFaceSmile, faFaceMeh, faFaceGrimace, faFaceTired
} from '@fortawesome/free-solid-svg-icons'

export default {
    init() {
        library.add(
            faPen, faXmark, faTrash, faCheck, faGears,
            faFire, faPersonRunning, faPersonWalking, faHourglass,
            faBagShopping, faPersonDigging, faMountain, faAppleWhole,
            faClipboardList, faHammer, faMagnifyingGlass, faScrewdriverWrench,
            faBoxArchive, faFileExport, faBoxesStacked,
            faAngleUp, faAngleDown, faExclamationCircle, faArrowUp,
            faCalendarDay, faCalendarPlus, faCalendarXmark,
            faFaceLaughWink, faFaceSmile, faFaceMeh, faFaceGrimace, faFaceTired
        )
    },
    component(app) {
        app.component("FontAwesomeIcon", FontAwesomeIcon)
    }
}