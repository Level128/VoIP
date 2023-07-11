// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { createApp } from 'vue'
import App from './App'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
// import store from '/core/services/store'
import store from '../src/core/services/store'
import ApiService from '../src/core/services/api.service'
import formLoading from 'vue2-form-loading'
import VueCookies from 'vue3-cookies'
import { VueSelect } from "vue-select";
// import Vuelidate from 'vuelidate'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import InputTag from 'vue-input-tag'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/css/main.css'


window.axios = require('axios')
ApiService.init()

const app = createApp(App);
app.use(router);
app.use(store);
Vue.use(formLoading);
Vue.use(VueSweetalert2);
Vue.use(require('vue-moment'));
app.use(VueCookies);
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
// Vue.use(Vuelidate)

app.component('input-tag', InputTag)
app.component('v-select', VueSelect)

app.mount('#app');
