<template>
  <main>
    <title>DegreeSee</title>
    <div v-if="signedIn === true && isLoading === false" class="dash-collection-home" id='content'>
      <dash-collection></dash-collection>
    </div>
    <!-- <div v-if="isLoading === true" class="loading">
      <p>loading...</p>
    </div> -->
  </main>
</template>

<script>
import { Auth } from 'aws-amplify';
import DashCollection from '@/components/dashboards/DashCollection.vue';

export default {
  name: 'DegreeSeeApp',
  data () {
    return {
      user: undefined,
      authState: undefined,
      signedIn: false
      // isLoading: false
    };
  },
  components: {
    DashCollection: DashCollection
  },
  beforeCreate () {
    Auth.currentAuthenticatedUser()
      .then(() => {
        this.signedIn = true;
      })
      .catch(() => {
        this.signedIn = false;
      });
  }
};
</script>

<style>

.dashboard {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

</style>
