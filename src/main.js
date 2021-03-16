import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import locale from 'element-ui/lib/locale/lang/th'

import '@/styles/index.scss' // global css
import '@/assets/custom-theme/index.css' // global css
import App from './App'
import router from './router'
import store from './store'
import VueHtmlToPaper from 'vue-html-to-paper';
import vuetify from '@/plugins/vuetify'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
//import wb from "./registerServiceWorker"
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}
Vue.use(VueHtmlToPaper, options);
//Vue.use(VueHtmlToPaper);
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale
})
//Vue.prototype.$workbox = wb
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  render: h => h(App)
})
