import Vue from 'vue';
import app from './App.vue';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

new Vue({
  el: '#app',
  render(h) {
    return h(app)
  }
});