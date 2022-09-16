import {createApp} from 'vue'
import './assets/css/style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "./assets/css/el-style.css"
import "./assets/fontello/css/fontello.css"
// @ts-ignore
import App from './App.vue'
import router from "./router";
import axios from "axios";
// @ts-ignore
import JsonViewer from "vue3-json-viewer";
import "vue3-json-viewer/dist/index.css";
/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faAddressBook,
    faAddressCard,
    faBell,
    faBellSlash,
    faBookmark,
    faBuilding,
    faCalendar,
    faCalendarCheck,
    faCalendarDays,
    faCalendarMinus,
    faCalendarPlus,
    faCalendarXmark,
    faChartBar,
    faChessBishop,
    faChessKing,
    faChessKnight,
    faChessPawn,
    faChessQueen,
    faChessRook,
    faCircle,
    faCircleCheck,
    faCircleDot,
    faCircleDown,
    faCircleLeft,
    faCirclePause,
    faCirclePlay,
    faCircleQuestion,
    faCircleRight,
    faCircleStop,
    faCircleUp,
    faCircleUser,
    faCircleXmark,
    faClipboard,
    faClock,
    faClone,
    faClosedCaptioning,
    faComment,
    faCommentDots,
    faComments,
    faCompass,
    faCopy,
    faCopyright,
    faCreditCard,
    faEnvelope,
    faEnvelopeOpen,
    faEye,
    faEyeSlash,
    faFaceAngry,
    faFaceDizzy,
    faFaceFlushed,
    faFaceFrown,
    faFaceFrownOpen,
    faFaceGrimace,
    faFaceGrin,
    faFaceGrinBeam,
    faFaceGrinBeamSweat,
    faFaceGrinHearts,
    faFaceGrinSquint,
    faFaceGrinSquintTears,
    faFaceGrinStars,
    faFaceGrinTears,
    faFaceGrinTongue,
    faFaceGrinTongueSquint,
    faFaceGrinTongueWink,
    faFaceGrinWide,
    faFaceGrinWink,
    faFaceKiss,
    faFaceKissBeam,
    faFaceKissWinkHeart,
    faFaceLaugh,
    faFaceLaughBeam,
    faFaceLaughSquint,
    faFaceLaughWink,
    faFaceMeh,
    faFaceMehBlank,
    faFaceRollingEyes,
    faFaceSadCry,
    faFaceSadTear,
    faFaceSmile,
    faFaceSmileBeam,
    faFaceSmileWink,
    faFaceSurprise,
    faFaceTired,
    faFile,
    faFileAudio,
    faFileCode,
    faFileExcel,
    faFileImage,
    faFileLines,
    faFilePdf,
    faFilePowerpoint,
    faFileVideo,
    faFileWord,
    faFileZipper,
    faFlag,
    faFloppyDisk,
    faFolder,
    faFolderClosed,
    faFolderOpen,
    faFontAwesome,
    faFutbol,
    faGem,
    faHand,
    faHandBackFist,
    faHandLizard,
    faHandPeace,
    faHandPointDown,
    faHandPointer,
    faHandPointLeft,
    faHandPointRight,
    faHandPointUp,
    faHandScissors,
    faHandshake,
    faHandSpock,
    faHardDrive,
    faHeart,
    faHospital,
    faHourglass,
    faHourglassHalf,
    faIdBadge,
    faIdCard,
    faImage,
    faImages,
    faKeyboard,
    faLemon,
    faLifeRing,
    faLightbulb,
    faMap,
    faMessage,
    faMoneyBill1,
    faMoon,
    faNewspaper,
    faNoteSticky,
    faObjectGroup,
    faObjectUngroup,
    faPaperPlane,
    faPaste,
    faPenToSquare,
    faRectangleList,
    faRectangleXmark,
    faRegistered,
    faShareFromSquare,
    faSnowflake,
    faSquare,
    faSquareCaretDown,
    faSquareCaretLeft,
    faSquareCaretRight,
    faSquareCaretUp,
    faSquareCheck,
    faSquareFull,
    faSquareMinus,
    faSquarePlus,
    faStar,
    faStarHalf,
    faStarHalfStroke,
    faSun,
    faThumbsDown,
    faThumbsUp,
    faTrashCan,
    faUser,
    faWindowMaximize,
    faWindowMinimize,
    faWindowRestore
} from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(faUser, faImage, faEnvelope, faStar, faHeart, faCircleXmark, faComment, faFaceSmile, faCalendarDays, faFile, faBell, faClipboard, faCircleUser, faCircleUp, faCircleDown, faBookmark, faPenToSquare, faShareFromSquare, faEye, faEyeSlash, faHand, faFolder, faFolderOpen, faThumbsUp, faThumbsDown, faComments, faLemon, faPaperPlane, faCompass, faAddressBook, faHandshake, faSnowflake, faSun, faCalendar, faClock, faCircle, faCreditCard, faCopy, faSquare, faNewspaper, faBuilding, faFlag, faFileExcel, faHandPointUp, faAddressCard, faRegistered, faMoon, faFileWord, faClosedCaptioning, faFilePdf, faHospital, faSquareCheck, faCopyright, faCircleCheck, faSquareMinus, faLightbulb, faKeyboard, faClone, faImages, faWindowRestore, faWindowMinimize, faWindowMaximize, faTrashCan, faStarHalfStroke, faStarHalf, faSquarePlus, faSquareFull, faSquareCaretUp, faSquareCaretRight, faSquareCaretLeft, faSquareCaretDown, faRectangleXmark, faRectangleList, faPaste, faObjectUngroup, faObjectGroup, faNoteSticky, faMoneyBill1, faMessage, faMap, faLifeRing, faIdCard, faIdBadge, faHourglassHalf, faHourglass, faHardDrive, faHandSpock, faHandScissors, faHandPointer, faHandPointRight, faHandPointLeft, faHandPointDown, faHandPeace, faHandLizard, faHandBackFist, faGem, faFutbol, faFontAwesome, faFolderClosed, faFloppyDisk, faFileZipper, faFileVideo, faFilePowerpoint, faFileLines, faFileImage, faFileCode, faFileAudio, faFaceTired, faFaceSurprise, faFaceSmileWink, faFaceSmileBeam, faFaceSadTear, faFaceSadCry, faFaceRollingEyes, faFaceMehBlank, faFaceMeh, faFaceLaughWink, faFaceLaughSquint, faFaceLaughBeam, faFaceLaugh, faFaceKissWinkHeart, faFaceKissBeam, faFaceKiss, faFaceGrinWink, faFaceGrinWide, faFaceGrinTongueWink, faFaceGrinTongueSquint, faFaceGrinTongue, faFaceGrinTears, faFaceGrinStars, faFaceGrinSquintTears, faFaceGrinSquint, faFaceGrinHearts, faFaceGrinBeamSweat, faFaceGrinBeam, faFaceGrin, faFaceGrimace, faFaceFrownOpen, faFaceFrown, faFaceFlushed, faFaceDizzy, faFaceAngry, faEnvelopeOpen, faCommentDots, faCircleStop, faCircleRight, faCircleQuestion, faCirclePlay, faCirclePause, faCircleLeft, faCircleDot, faChessRook, faChessQueen, faChessPawn, faChessKnight, faChessKing, faChessBishop, faChartBar, faCalendarXmark, faCalendarPlus, faCalendarMinus, faCalendarCheck, faBellSlash)


const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.provide('global', {axios})
app.use(router)
app.use(JsonViewer);
app.use(ElementPlus, {
    locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
