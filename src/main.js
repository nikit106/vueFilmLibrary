// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.use(Vuelidate)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    var firebaseConfig = {
      apiKey: 'AIzaSyBjEy_kCyL6TkrSXtyiQT8K7AJuZC-ulhE',
      authDomain: 'vuefilmlibrary-80938.firebaseapp.com',
      databaseURL: 'https://vuefilmlibrary-80938.firebaseio.com',
      projectId: 'vuefilmlibrary-80938',
      storageBucket: 'vuefilmlibrary-80938.appspot.com',
      messagingSenderId: '867059025187',
      appId: '1:867059025187:web:345ac8ed811936806ff896'
    }
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('loggedUser', user)
      }
      this.$store.dispatch('loadTasks')
    })
  }
})
