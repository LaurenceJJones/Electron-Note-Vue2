import Vue from 'vue';
import app from './App.vue';
import 'bulma/css/bulma.css';
import './app.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.css';

new Vue({
  el: '#app',
  render(h) {
    return h(app)
  }
});