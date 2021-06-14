
<template>
  <div class="modal add-dash-modal" v-show='value'>
    <v-container>
      <v-card class="pa-4 d-flex flex-column justify-start">
        <div class='modal-close'>
          <v-btn @click.prevent='close' class='modal-close-btn' small icon color='grey darken-1'>
            <v-icon>clear</v-icon>
          </v-btn>
        </div>
        <div>
          <h3 class="modal-title">Add a New Dashboard</h3>
        </div>
        <add-dashboard-form></add-dashboard-form>
      </v-card>
    </v-container>
  </div>
</template>
    
<script>

import AddDashboardForm from '@/components/dashboards/AddDashboardForm.vue';
  
export default {
  name: 'AddDashboardModal',
  props: {
    value: {
      required: true
    }
  },
  methods: {
    close () {
      this.$emit('input', !this.value);
    }
  },
  computed: {
    // dashKey() {
    //   return this.$store.getters.dashKey;
    // }
  },
  components: {
    AddDashboardForm: AddDashboardForm
  }
};
</script>

<style lang="css" scoped>

.modal-close-btn {
  float: right;
}
.modal-close {
  justify-content: right;
}
.modal-title {
  padding: 0;
}
</style>

    <!-- <button @click='showModal = true' class='button' id='show-modal'> Add Dashboard </button>
    <modal v-if='showModal' @close='showModal = false'>
      <h3 slot='add-dashboard'>name: 'dash name input goes here'</h3>
    </modal> -->
