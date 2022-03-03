import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueAuthImage from 'vue-auth-image';
import VueAxios from 'vue-axios';

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
  render: h => h(App)
}).$mount('#app');

 
 