import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
      themes: {
        light: {
            // green: "#97D490",
            // primary: "#97D490",
            primary: "#3d6728",
            green: "#3d6728",
            // secondary: "#FFFFFF",
            secondary: "#181a1b",
            yellow: "#856f06",
            background: "#856f06",
            // yellow: "#F6D42A",
            // background: "#EDCB23",
        }
      }
    }
  });
