import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme:{
    themes: {
      light: {
        primary: "#97D490",
        secondary: "#FFFFFF",
        background: "#EDCB23",
      }
    }
  }
});
