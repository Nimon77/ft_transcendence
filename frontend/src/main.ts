import Vue from 'vue';
import axios from 'axios';
import VueAuthImage from 'vue-auth-image';
import VueAxios from 'vue-axios';
import "vue-toastification/dist/index.css";

import App from './App.vue';
import store from './store'
import router from './router';
import vuetify from './plugins/vuetify';

import './plugins/toast';
import './plugins/notify';

Vue.prototype.$http = axios;
// Vue.prototype.$http = axios
Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueAuthImage);
// put to uppercase
Vue.filter("upCase", value => {
  if (!value) return ''
  return value.toUpperCase();
})

axios.defaults.baseURL = "http://" + location.hostname + ":" + process.env.VUE_APP_BACKEND_PORT;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app');

 
 