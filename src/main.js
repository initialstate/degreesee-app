import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-vue';
import vuetify from './plugins/vuetify';

import 'material-design-icons-iconfont/dist/material-design-icons.css';

Amplify.configure(awsconfig);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  created: () => {
    console.log('running created() setDashboards from main.js');
    store.dispatch('setDashboards');
  },
  render: h => h(App)
}).$mount('#app');
