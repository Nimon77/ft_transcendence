import Vue from 'vue';
import axios from 'axios';
import VueAuthImage from 'vue-auth-image';
import VueAxios from 'vue-axios';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import store from './store'

Vue.prototype.$http = axios;
// Vue.prototype.$http = axios
Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueAuthImage);
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

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

 
 