// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import App from './App'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
// import store from '/core/services/store'
import store from '../src/core/services/store'
import ApiService from '../src/core/services/api.service'
import formLoading from 'vue2-form-loading'
import { VueSelect } from "vue-select";

var VueCookie = require('vue-cookie')
window.axios = require('axios')
ApiService.init()

const app = createApp(App);
app.use(router);
app.use(store);
app.use(formLoading);
app.use(VueCookie);
app.use(VueSweetalert2);
app.use(require('vue-moment'));

app.component('v-select', VueSelect)

app.mount('#app');
