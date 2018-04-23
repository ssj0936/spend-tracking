// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
// import Velocity from 'velocity-animate';

var $ = require('jquery');
window.jQuery = window.$ = $;

// import 'jquery';
// import 'velocity-animate';
// import 'velocity-animate/velocity.ui';

require('velocity-animate');
require('velocity-animate/velocity.ui');

import store from './store';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
