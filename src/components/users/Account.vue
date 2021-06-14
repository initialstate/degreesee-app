<template>
  <div>
    <h1>Account</h1>
    <h3>Welcome, {{email}} </h3>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  name: 'Account',
  data () {
    return {
      user: {},
      email: ''
    };
  },
  beforeCreate () {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.user = user;
        this.email = user.attributes.email;
      })
      .catch(() => console.log('not signed in...'));
  }
};
</script>
