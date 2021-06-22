<template>
  <div>
    <v-container class='form-body'>
      <v-form id='add-dashboard-form' v-model='valid' ref="form" lazy-validation>
        <v-text-field
        v-model='key'
        label='dashboard key'
        :rules="keyRules"
        required
        ></v-text-field>
        <v-text-field
        v-model='name'
        label='dashboard name'
        :rules="nameRules"
        required
        ></v-text-field>
          <v-btn id='dashKey' @click='addDashboard(key, name)' :disabled='!valid' color='white' outlined class='secondary'>
            <p class="info--text mt-4 font-weight-bold">Submit</p>
          </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'AddDashboardForm',
  data () {
    return {
      key: '',
      name: '',
      keyRules: [
        v => !!v || 'key is required'
      ],
      nameRules: [v => !!v || 'name is required'],
      valid: false
    };
  },
  methods: {
    addDashboard (key, name) {
      const dash = {
        bucketId: key,
        name: name
      };
      this.$store.dispatch('addDashboard', dash);
      this.$refs.form.reset();
    }
  }
};
</script>

<style lang="css" scoped>

</style>
