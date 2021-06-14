import Vue from 'vue';
import Vuex from 'vuex';

import { API } from 'aws-amplify';

Vue.use(Vuex);

const getInitialState = () => {
  return {
    dashKey: null,
    dashName: null,
    dashId: null,
    dashboards: [],
    user: null,
    signedIn: false,
    authState: null,
    status: 'empty',
    totalDashboards: 0
  };
};

const state = getInitialState();

const getters = {
  dashKey: state => {
    return state.dashKey;
  },
  dashName: state => {
    return state.dashName;
  },
  dashboards: state => {
    console.log('getting dashboards');
    return state.dashboards;
  },
  user: state => {
    return state.user;
  },
  userPresent: state => {
    if (state.signedIn === true) {
      return true;
    }
  }
};

const actions = {
  setDashKey: ({ commit }, key) => {
    commit('SET_DASH_KEY', key);
  },
  setDashName: ({ commit }, name) => {
    commit('SET_DASH_NAME', name);
  },
  setDashboards: ({ commit }) => {
    console.log({ msg: 'store.js setDashboards action' });

    API.get('dashApi', '/dashboards', {
      response: true
    }).then(result => {
      console.log({ dashResult: result.data });
      if (result.data) {
        const dashboards = result.data.data;
        console.log({ function: 'store_actions_setDashboards', dashboards: dashboards });
        commit('SET_DASHBOARDS', dashboards);
        return dashboards;
      }
    }).catch(err => {
      console.log('Oh my, an unfortunate event has occured: ', err);
      return err;
    });
  },
  setUser: ({ commit }, user) => {
    console.log('setting_user');
    commit('SET_USER', user);
  },
  addDashboard: ({ commit }, dash) => {
    console.log('addDashboardDashKey: ', dash);

    if (!dash) {
      console.log('missing data');
      return new Error('Invalid Entry');
    }

    API.post('dashApi', '/dashboards', {
      body: {
        key: dash.bucketId,
        name: dash.name
      }
    })
      .then(result => {
        console.log({ postDashResult: result });

        commit('ADD_DASHBOARD', result.dashboard);

        return 'success';
      }).catch(err => {
        console.log('Shoot, I\'m unable to add that... ', err);
        return err;
      });
  },
  deleteDashboard: ({ commit }, dashId) => {
    if (!dashId) {
      console.log('missing data');
      return Promise.reject(new Error('Invalid ID'));
    }
    console.log('deleteDashboard func ', dashId);

    const path = '/dashboards' + `/${dashId}`;
    console.log({ path: path });

    API.del('dashApi', path, {
      body: {
        dashId: dashId
      }
    })
      .then(result => {
        console.log({ deleteResult: result });
        console.log({ _dashId: dashId });

        commit('REMOVE_DASHBOARD_BY_ID', dashId);

        return 'success';
      }).catch(err => {
        console.log('Oh my, I may have failed to delete that... ', err);
        return err;
      });
  },
  reset: ({ commit }) => {
    commit('RESET');
  }
};

const mutations = {
  SET_DASH_KEY: (state, key) => {
    state.dashKey = key;
  },
  SET_DASH_NAME: (state, name) => {
    state.dashName = name;
  },
  SET_DASHBOARDS: (state, dashboards) => {
    state.dashboards = dashboards;
  },
  SET_USER: (state, user) => {
    state.signedIn = true;
    state.user = user;
  },
  ADD_DASHBOARD: (state, dash) => {
    if (!dash) {
      return new Error('Invalid Entry');
    }
    console.log('ADD_DASHBOARD func: ', dash);

    state.dashboards.push(dash);
  },
  REMOVE_DASHBOARD_BY_ID: (state, dashId) => {
    if (!dashId) {
      return new Error('Invalid ID');
    }
    const idx = state.dashboards.findIndex(x => dashId !== null && x.dashId === dashId);

    console.log({ dashId: dashId, index: idx });

    if (idx >= 0) {
      state.dashboards.splice(idx, 1);
    }
  },
  RESET: (state) => {
    console.log('reset people...');
    Object.assign(state, getInitialState());
  }
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
