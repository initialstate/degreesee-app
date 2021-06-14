<template>
  <v-app id="app">
    <app-header></app-header>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { Auth, Hub } from 'aws-amplify';
import Header from './components/Header';

export default {
  name: 'App',
  data () {
    return {
      signedIn: false
    };
  },
  components: {
    appHeader: Header
  },
  beforeCreate () {
    Hub.listen('auth', data => {
      console.log('listening....');
      const { payload } = data;
      if (payload.event === 'signIn') {
        console.log('Hub.listen func: user is signed in');
        this.$store.dispatch('setUser', data);
        this.$store.dispatch('setDashboards', data);
        console.log('App: setting dashboards in beforeCreate');
        this.$router.push('/dashboards');
      }
      if (payload.event === 'signOut') {
        const path = '/auth';
        if (this.$route.path !== path) { this.$router.push(path); }
        // flush state data
        this.$store.dispatch('reset', data);
        console.log('App: user is signed out');
      }
    });
    Auth.currentAuthenticatedUser()
      .then((data) => {
        console.log('App: signedIn = true');
        this.signedIn = true;
        this.user = data;
      })
      .catch(() => {
        console.log('App: signedIn = false');
        this.signedIn = false;
      });
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap');

body {
  margin: 0px;
}

#app {
  background: url('assets/bggaugefill.svg');
  height: 100vh;
  background-repeat: no-repeat;
  background-position: 100% 0;
  background-size: contain;
}

h1, h2, h3, p, label, input {
  font-family: 'Montserrat';
}

:root {
  --amplify-primary-color: #275ba7;
  --amplify-primary-tint: #e05800;
  --amplify-primary-shade: #fd9653;
}
</style>
