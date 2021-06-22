<template>
  <div id='dash-collection-container'>
    <v-container id=dashboard-grid-container class='dash-collection' ma-7>
      <v-row>
        <v-col>
          <v-row class= "pl-5 pb-5">
            <span class='dash-collection-title'><h2>Your Dashboards</h2></span>
            <v-btn
              @click='showModal'
              class='mx-2 add-dashboard-modal-button'
              fab
              color='secondary'
              x-small
              elevation='4'
            >
            <v-icon class='add-button'>
              mdi-plus
            </v-icon>
            </v-btn>
            <add-dashboard-modal v-model='modalOpen'></add-dashboard-modal>
          </v-row>
          <v-row v-if='!dashboards'>
            <v-col>
              <span> No dashboards to display. Please add one! </span>
            </v-col>
          </v-row>
          <v-row v-if='dashboards'>
            <v-col v-for="dashboard in dashboards" :key="dashboard.dashId" lg='4' md='6' s='6' xs='12' wrap id='dashboard-column'>
              <v-card class='justify-space-between mx-auto' elevation='4' outlined id='dashboard-card-container' color='primary'>
                <v-list-item three-line elevation='4'>
                  <v-list-item-content>
                    <v-list-item-title class="info--text">
                      <p class="font-weight-bold pl-3">{{ dashboard.name }}</p>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-card-actions class="d-flex justify-space-between">
                  <v-btn
                    :to="{name: 'DashboardEmbed', params: {dashId: dashboard.bucketId, type: 'tiles' }}"
                    rounded
                    text
                    color='white'
                  >
                    <v-icon>dashboard</v-icon>
                  </v-btn>
                  
                  <v-btn
                    :to="{name: 'DashboardEmbed', params: {dashId: dashboard.bucketId, type: 'waves' }}"
                    rounded
                    text
                    color='white'
                  >
                    <v-icon>waves</v-icon>
                  </v-btn>
                  
                  <v-btn
                    :to="{name: 'DashboardEmbed', params: {dashId: dashboard.bucketId, type: 'lines' }}"
                    rounded
                    text
                    color='white'
                  >
                    <v-icon>show_chart</v-icon>
                  </v-btn>
                  
                  <v-btn
                    rounded
                    text
                    color='white'
                    @click='deleteDashboard(dashboard.dashId)'
                  >
                    <v-icon id='delete-btn' right>delete_forever</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AddDashboardModal from '@/components/dashboards/AddDashboardModal.vue';

export default {
  name: 'DashCollection',
  data () {
    return {
      modalOpen: false
      
    };
  },
  methods: {
    showModal () {
      this.modalOpen = !this.modalOpen;
    },
    deleteDashboard: function (dashId) {
      this.$store.dispatch('deleteDashboard', dashId);
    }
  },
  computed: {

    ...mapState({
      
      dashboards (state) {
        const dashboards = state.dashboards;
        return dashboards;
      }
      
    })
  },
  components: {
    AddDashboardModal: AddDashboardModal
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='css' scoped>

body { padding: 1rem; }

#dashboard-card-container {
  min-width: 300px;
  max-width: 344px;

}

#delete-btn {
  color: white;
  font-size: 26px
}

.add-dashboard-modal-button {
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  margin: 4px 2px;

}

</style>
