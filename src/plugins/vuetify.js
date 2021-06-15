import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#E05800', // orange
        secondary: '#0D4494', // blue
        accent: '#FF9956', // light orange
        error: '#FF5252',
        info: '#FFFFFF', // white
        success: '#4CAF50',
        warning: '#FFC107'
      }
    }
  }
});
