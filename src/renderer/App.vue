<template>
  <div>
      <section class="section" v-if="check">
        <login />
      </section>
      <div v-else>
        <user-top />
        <section class="section">
          <form-top />
          <reminder-main />
          <nav-bottom />
        </section>
      </div>
      <new-reminder />
      <na />
      <todo />
      <history />
      <script-builder />
      <urls />
      <collections />
      <sys-conf />
  </div>
</template>

<script>
//Q:\Company Work\Customer Services\Support\URLs on FTP.txt
import navBottom from './components/header.vue';
import userTop from './components/user.vue'
import formTop from './components/form.vue';
import login from './components/login.vue';
import history from './components/history.vue';
import na from './components/na.vue';
import todo from './components/todo.vue';
import reminderMain from './components/reminderMain.vue';
import newReminder from './components/reminder.vue';
import scriptBuilder from './components/script.vue';
import collections from './components/collection.vue';
import urls from './components/urls.vue';
import sysConf from './components/sysConf.vue';

const fs = require('fs');
const moment = require('moment');
const notifier = require('node-notifier');

export default {
  components: {
    navBottom,
    formTop,
    login,
    history,
    userTop,
    na,
    todo,
    reminderMain,
    newReminder,
    scriptBuilder,
    collections,
    urls,
    sysConf
  },
  computed : {
    check(){
        return (this.$store.state.config.user) ? false : true;
    }
  },
  methods:{
    checkTime(){
      for(let i = 0; i < this.$store.state.files.reminder.length; i++){
        const element = this.$store.state.files.reminder[i];
        switch(element.date){
          case moment().format('YYYY-MM-DD'):
          if(moment(element.time, 'HH:mm').isSameOrBefore()){
              element.class = 'is-danger';
              if(moment(element.time, 'HH:mm').isSame(moment(), 'minute')){
                notifier.notify({
                    title: element.time,
                    message: element.customerName,
                    sound: false,
                    wait: true
                  },
                  function(err, response) {
                    if (err) throw err
                  }
                );
              }
            }else if(moment(element.time, 'HH:mm').isSameOrAfter()){
              if(moment(element.time,'HH:mm').diff(moment(), 'minutes') < 45){
                element.class = 'is-warning';
              }else{
                element.class = 'is-success'
              }
            }
          break;
          default:
          if(moment(element.date, 'YYYY-MM-DD').isSameOrBefore()){
            element.class = 'is-danger';
          }else if(moment(element.date, 'YYYY-MM-DD').isSameOrAfter()){
            element.class = 'is-success';
          }
        }
      }
      let end = moment().endOf('minute');
      let now = moment();
      let diff  = end.diff(now);
      setTimeout(() => {
      this.checkTime();
      this.$store.commit('writeData', {loc: 'reminder'})
      }, diff);
    },
    checkDay(){
      let diffDay = moment().endOf('day').add( 1 , 'm').diff(moment());
      setTimeout(() => {
        this.checkDay();
        this.$store.commit('initDays', moment().format('YYYY-MM-DD'));
      }, diffDay);
    }
  },
  created() {
    this.$store.dispatch('init');
    this.checkTime();
  }
}
</script>

<style>
</style>