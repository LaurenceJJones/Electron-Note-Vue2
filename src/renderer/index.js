import Vue from 'vue';
import app from './App.vue';
import Buefy from 'buefy';
import 'bulma/css/bulma.css';
import 'buefy/dist/buefy.css';
import './app.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.css';

import {store} from './store';

Vue.use(Buefy);
new Vue({
  el: '#app',
  store,
  render(h) {
    return h(app)
  }
});