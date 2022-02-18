import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VueAuthImage from 'vue-auth-image';

Vue.prototype.$http = axios
Vue.config.productionTip = false
// register vue-auth-image directive
Vue.use(VueAuthImage);
// set Authorization header used by axios
        
const authHeader = 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDAyNyIsImlhdCI6MTY0NTEyNDQ4MSwiZXhwIjoxNjQ1NzI5MjgxfQ.EudjZqlqBVPWR0B1gyt6UZs46q_ZSqg6yLPpCPX9UT8';
axios.defaults.headers.common['Authorization'] = authHeader;

new Vue({
  router,
  vuetify,
  VueAuthImage,
  render: h => h(App)
}).$mount('#app')

 
 