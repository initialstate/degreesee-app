<!-- eslint-disable -->
<template>
<div>
    <v-app-bar v-show="windowWidth => 700" prominent dense app class="primary">
          <v-container v-resize="onResize" class="d-flex align-center justify-space-between" fluid>      
          <v-img
            src="images/degreesee-logo-long.svg"
            alt="DegreeSee Logo"
            class='desktop-logo'
            min-width="250"
            max-width="300"
          ></v-img>
        <v-layout class='routing' align-center justify-end md="6">
          <router-link to='/dashboards'>
          <v-btn class='button' color='white' text>DASHBOARDS</v-btn>
        </router-link>
          <router-link to='/account'>
          <v-btn class='button' color='white' text>ACCOUNT</v-btn>
        </router-link>
       <div v-if="authState === 'signedin' || signedIn === true" text class="signout">
        <amplify-sign-out></amplify-sign-out>
       </div>
      </v-layout>
      </v-container>
  </v-app-bar>

  <v-app-bar v-show="windowWidth < 700" prominent app class="primary" height="200">
      <v-container v-resize="onResize" class="d-flex flex-column align-center">
          <v-img
          mb-4
            src="images/degreesee-logo-short.svg"
            alt="DegreeSee Logo"
            class='mobile-logo'
          ></v-img>
          <router-link to='/dashboards'>
          <v-btn class='button' color='white' text>DASHBOARDS</v-btn>
        </router-link>
          <router-link to='/account'>
          <v-btn class='button' color='white' text>ACCOUNT</v-btn>
        </router-link>
      <div v-if="authState === 'signedin' || signedIn === true" text class="signout">
        <amplify-sign-out></amplify-sign-out>
      </div>
    </v-container>
  </v-app-bar>
</div>
</template>

<script>
/* eslint-disable */
import { Auth } from "aws-amplify";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

export default {
  name: "NavBar",
  data: () => ({
    logoIcon: "@/assets/degreesee-logo-icon.png",
    logoName: "@/assets/degreesee-logo-name.png",
    link: "https://www.degreesee.com",
    user: undefined,
    signedIn: undefined,
    authState: undefined,
    windowWidth: 0,
  }),
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  created() {
    onAuthUIStateChange((authState) => {
      this.authState = authState;
    });
  },
  beforeCreate() {
    Auth.currentAuthenticatedUser()
      .then((data) => {
        this.signedIn = true;
        this.user = data;
      })
      .catch(() => {
        this.signedIn = false;
      });
  },
  mounted() {
    console.log(this.$vuetify.breakpoint);
    this.onResize();
  },
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
  outline-color: white;
}

/* @media only screen and (max-width: 671px) {
  .mobile-logo {
    display: block;
  }
  .desktop-logo {
    display: none;
  } 
} */
</style>
