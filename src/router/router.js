import { createRouter, createWebHistory } from 'vue-router'
import AppCenter from '../components/AppCenter.vue'
import AppNav from '../components/AppNav.vue'
import AppWeather from '../views/nav/AppWeather.vue'
import AppBookASeak from '../views/nav/AppBookASeak.vue'
import AppBookATransfer from '../views/nav/AppBookATransfer.vue'
import AppSearch from '../views/nav/AppSearch.vue'
import AppRegister from '../views/nav/AppRegister.vue'
import AppLogin from '../views/nav/AppLogin.vue'
import AppHome from '../views/nav/AppHome.vue'
import AppInfo from '../views/slider/AppInfo.vue'
import AppTransferTaksi from '../views/slider/AppTransferTaksi.vue'
import AppHabitation from '../views/slider/AppHabitation.vue'
import AppRental from '../views/slider/AppRental.vue'
import AppEvents from '../views/slider/AppEvents.vue'
import AppForChildren from '../views/slider/AppForChildren.vue'
import AppInstructorTours from '../views/slider/AppInstructorTours.vue'
import AppNews from '../views/slider/AppNews.vue'
import AppAds from '../views/slider/AppAds.vue'
import AppTransfer from '../views/center/AppTransfer.vue'
import AppTaxiDelivery from '../views/center/AppTaxiDelivery.vue'
import AppHotel from '../views/habination/AppHotel.vue'
import AppCardOpen from '../components/AppCardOpen.vue'
import AppCreateCard from '../components/AppCreateCard.vue'
import AppCreateNews from '../components/AppCreateNews.vue'
import AppCreateTransfer from '../components/AppCreateTransfer.vue'
import AppCreateService from '../components/AppCreateService.vue'
import AppTransferCardOpen from '../components/AppTransferCardOpen.vue'
import ServiceCard from '../components/ServiceCard.vue'
import AppLift from '../views/info/AppLift.vue'
import AppCreateLift from '../views/info/AppCreateLift.vue'
import AppCameras from '../views/info/AppCameras.vue'
import AppMap from '../views/info/AppMap.vue'
import AppEmergency from '../views/info/AppEmergency.vue'
import AppSkipass from '../views/info/AppSkipass.vue'
import AppSkipassCreate from '../views/info/AppSkipassCreate.vue'
import AdminReq from '../views/admin/AdminReq.vue'
import AdminSections from '../views/admin/AdminSections.vue'
import AdminEvents from '../views/admin/AdminEvents.vue'
import AdminForChildren from '../views/admin/AdminForChildren.vue'
import AdminHabitation from '../views/admin/AdminHabitation.vue'
import AdminRental from '../views/admin/AdminRental.vue'
import AdminTransferTaksi from '../views/admin/AdminTransferTaksi.vue'
import AdminInstructorTours from '../views/admin/AdminInstructorTours.vue'
import AdminAds from '../views/admin/AdminAds.vue'
import AppProfile from '../components/AppProfile.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppHome,
    },
    {
      path: '/nav',
      name: 'nav',
      component: AppNav,
    },
    {
      path: '/weather',
      name: 'weather',
      component: AppWeather,
    },
    {
      path: '/book_a_seat',
      name: 'book_a_seat',
      component: AppBookASeak,
    },
    {
      path: '/book_a_transfer',
      name: 'book_a_transfer',
      component: AppBookATransfer,
    },
    {
      path: '/search',
      name: 'search',
      component: AppSearch,
    },
    {
      path: '/register',
      name: 'register',
      component: AppRegister,
    },
    {
      path: '/login',
      name: 'login',
      component: AppLogin,
    },
    {
      path: '/info',
      name: 'info',
      component: AppInfo,
    }, 
    {
      path: '/transfer-taksi',
      name: 'transfer-taksi',
      component: AppTransferTaksi,
    }, 
    {
      path: '/habitation',
      name: 'habitation',
      component: AppHabitation,
    }, 
    {
      path: '/habitation/items',
      name: 'habitationItems',
      component: AppHotel,
    }, 
    {
      path: '/rental',
      name: 'rental',
      component: AppRental,
    }, 
    {
      path: '/rental/items',
      name: 'rentalItems',
      component: AppHotel,
    }, 
    {
      path: '/events',
      name: 'event',
      component: AppEvents,
    }, 
    {
      path: '/event/items',
      name: 'eventItems',
      component: AppHotel,
    }, 
    {
      path: '/forChildren',
      name: 'forChildren',
      component: AppForChildren,
    }, 
    {
      path: '/forChildren/items',
      name: 'forChildrenItems',
      component: AppHotel,
    }, 
    {
      path: '/instructor-tours',
      name: 'instructor-tours',
      component: AppInstructorTours,
    }, 
    {
      path: '/instructor-tours/items',
      name: 'instructorToursItems',
      component: AppHotel,
    }, 
    {
      path: '/news',
      name: 'news',
      component: AppNews,
    }, 
    {
      path: '/ads',
      name: 'ads',
      component: AppAds,
    },
    {
      path: '/ads/items',
      name: 'adsItems',
      component: AppHotel,
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: AppTransfer,
    },
    {
      path: '/taxi-delivery',
      name: 'taxi-delivery',
      component: AppTaxiDelivery,
    },
    {
      path: '/taxi-delivery/card',
      name: 'serviceCardOpen',
      component: ServiceCard,
    },
    {
      path: '/card',
      name: 'card',
      component: AppCardOpen,
    },
    {
      path: '/create-card',
      name: 'createCard',
      component: AppCreateCard,
    },
    {
      path: '/create-news',
      name: 'createNews',
      component: AppCreateNews,
    },
    {
      path: '/create-transfer',
      name: 'createTransfer',
      component: AppCreateTransfer,
    },
    {
      path: '/create-service',
      name: 'createService',
      component: AppCreateService,
    },
    {
      path: '/transfer/card',
      name: 'transfercard',
      component: AppTransferCardOpen,
    },
    {
      path: '/lift',
      name: 'lift',
      component: AppLift,
    },
    {
      path: '/lift/create-lift',
      name: 'appcreatelift',
      component: AppCreateLift,
    },
    {
      path: '/cameras',
      name: 'appcameras',
      component: AppCameras,
    },
    {
      path: '/map',
      name: 'appmap',
      component: AppMap,
    },
    {
      path: '/emergency',
      name: 'appemergency',
      component: AppEmergency,
    },
    {
      path: '/skipass',
      name: 'skipass',
      component: AppSkipass,
    },
    {
      path: '/skipass/create',
      name: 'skipasscreate',
      component: AppSkipassCreate,
    },
    {
      path: '/admin/requests',
      name: 'adminreq',
      component: AdminReq,
    },
    {
      path: '/admin/sections',
      name: 'adminsections',
      component: AdminSections,
    },
    {
      path: '/admin/events',
      name: 'adminevents',
      component: AdminEvents,
    },
    {
      path: '/admin/for-children',
      name: 'adminforchildren',
      component: AdminForChildren,
    },
    {
      path: '/admin/habitation',
      name: 'adminhabitation',
      component: AdminHabitation,
    },
    {
      path: '/admin/instructor-tours',
      name: 'admininstructortours',
      component: AdminInstructorTours,
    },
    {
      path: '/admin/rental',
      name: 'adminrental',
      component: AdminRental,
    },
    {
      path: '/admin/transfer-taksi',
      name: 'admintransfertaksi',
      component: AdminTransferTaksi,
    },
    {
      path: '/admin/ads',
      name: 'adminads',
      component: AdminAds,
    },
    {
      path: '/profile',
      name: 'profile',
      component: AppProfile,
    },
  ]
})

export default router