<template>
  <v-app-bar prominent dense app class="primary">
    <v-container  class="d-flex align-center" fluid>
      <v-layout justify-left>
          <v-img
            src="../assets/degreesee-desktop.svg"
            alt="DegreeSee Logo"
            max-width="300"
            class='logo'
          ></v-img>
      </v-layout>
      <v-spacer></v-spacer>
      <v-layout class='routing' justify-end>
        <router-link to='/dashboards'>
          <v-btn class='button' color='white' text>DASHBOARDS</v-btn>
        </router-link>
        <router-link to='/account'>
          <v-btn class='button' color='white' text>ACCOUNT</v-btn>
        </router-link>
      </v-layout>
      <div v-if="authState === 'signedin' || signedIn === true" text class="signout">
        <amplify-sign-out></amplify-sign-out>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
import { Auth } from 'aws-amplify';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

export default {
  name: 'NavBar',
  data: () => ({
    logoIcon: '@/assets/degreesee-logo-icon.png',
    logoName: '@/assets/degreesee-logo-name.png',
    link: 'https://www.degreesee.com',
    user: undefined,
    signedIn: undefined,
    authState: undefined
  }),
  created () {
    onAuthUIStateChange((authState) => {
      this.authState = authState;
      console.log({ authState: authState });
    });
  },
  beforeCreate () {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        console.log('header beforeCreate: signedIn = true');
        this.signedIn = true;
        this.user = data;
      })
      .catch(() => {
        console.log('header beforeCreate: signedIn = false');
        this.signedIn = false;
      });
  }
};
</script>

<style scoped>

.button {
  float: right;
  color: white;
  padding: 9px;
  font-size: large;
}

button:active {
  outline-width: 1;
  outline-color:white;
}
</style>
