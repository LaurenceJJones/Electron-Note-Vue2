<template>
  <div>
      <section class="section" v-if="check">
        <login @userSet="userSet"/>
      </section>
      <div v-else>
        <user-top :user="user" @resetUser="resetUser"/>
        <section class="section">
          <form-top @historyMount="mountHistory" :user="user" @naShow="showNA"/>
          <reminder-main @reminderShow="showReminder" :reminders="reminderList" @snoozeIndex="indexSnooze" @reminderComp="compReminder" @reminderDelete="deleteReminder"/>
          <nav-bottom
          @historyShow="showHistory" @todoShow="showTodo" @scriptShow="showScript" @collectionShow="showCollection" @urlsShow="showUrls"
          :historyActive="historyShow" :todoActive="todoShow" :scriptActive="scriptShow" :collectionActive="collectionShow" :urlsActive="urlsShow"
          />
        </section>
      </div>
      <new-reminder :show="reminderShow" @close="showReminder" @addReminder="mountReminder"/>
      <na :show="naShow" @close="showNA" :user="user"/>
      <todo :show="todoShow" @close="showTodo" :todoList="todoList" @newTodo="mountTodo" @compTodo="compTodo"></todo>
      <history :show="historyShow"  @close="showHistory" :historys="filteredHistory" @filterHistory="historyFilter" @countInc="historyFilter"/>
      <script-builder :show="scriptShow" @close="showScript"/>
      <urls :show="urlsShow" @close="showUrls"/>
      <collections :show="collectionShow" @close="showCollection"/>
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

const fs = require('fs');
const moment = require('moment');
const notifier = require('node-notifier');
const dotenv = require('dotenv');

export default {
  data(){
    return{
      user: null,
      historyShow : false,
      naShow : false,
      todoShow : false,
      reminderShow: false,
      scriptShow: false,
      collectionShow: false,
      urlsShow: false,
      obj : {"table":[]},
      filteredHistory : [],
      count : 10,
      todoList : [],
      reminderList: []
    }
  },
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
    urls
  },
  computed : {
    check(){
        return (this.user) ? false : true;
    }
    
  },
  methods:{
    userSet(data){
      this.user = data;
      fs.writeFile('.env.override',`DB_USER=${this.user}`, 'utf8', err => {
        if (err) throw err;
      });
    },
    showScript(){
      this.scriptShow = !this.scriptShow;
    },
    showCollection(){
      this.collectionShow = !this.collectionShow;
    },
    showTodo(){
      this.todoShow = !this.todoShow;
    },
    showNA(){
      this.naShow = !this.naShow;
    },
    showHistory(){
      this.historyShow = !this.historyShow;
      if(!this.historyShow){
        this.count = 10;
        this.historyFilter('');
      }
    },
    showReminder(){
      this.reminderShow = !this.reminderShow;
    },
    showUrls(){
      this.urlsShow = !this.urlsShow;
    },
    mountHistory(data){
      if (data){
        this.obj.table.push(data);
        this.historyFilter('');
      }else {
        if (fs.existsSync('./history.json')) {
          fs.readFile('history.json', 'utf8', (err, data) => {
            this.obj = JSON.parse(data);
            this.historyFilter('');
          });
        }
      }
    },
    mountTodo(data){
      if (data){
        this.todoList.push(data);
        this.writeTodo();
      }  else {
        if (fs.existsSync('./todo.json')) {
          fs.readFile('todo.json', 'utf8', (err, data) => {
            this.todoList = JSON.parse(data);
          });
        }
      }
    },
    writeTodo(){
      if (fs.existsSync('./todo.json')) {
        fs.readFile('todo.json', 'utf8', (err, data) => {
          if (err) throw err;
          else {
            fs.writeFile('todo.json', JSON.stringify(this.todoList), 'utf8', err => {
              if (err) throw err;
            });
          }
        });
      }else {
        fs.writeFile('todo.json', JSON.stringify(this.todoList), 'utf8', err => {
          if (err) throw err;
        });
      }
    },
    mountReminder(data){
      if (data){
        this.reminderList.push(data);
        if (fs.existsSync('./reminder.json')) {
          this.reminderFunc();
        } else {
          this.reminderFunc();
        }
      }else {
        if (fs.existsSync('./reminder.json')) {
          fs.readFile('reminder.json', 'utf8', (err, data) => {
            this.reminderList = JSON.parse(data);
          });
        }
      }
    },
    resetUser(){
      this.user = '';
      fs.writeFile('.env.override',`DB_USER=${this.user}`, 'utf8', err => {
        if (err) throw err;
      });
    },
    compTodo(index){
      this.todoList[index].comp = !this.todoList[index].comp;
      this.writeTodo();
    },
    historyFilter(data){
      let bol = data !== '' ? true : false;
      if (bol){
        this.count += 10;
        let filteredHistory = this.obj.table.filter((history) => {
          return history.name.toLowerCase().includes(data.toLowerCase()) || history.date.toLowerCase().includes(data.toLowerCase()) || history.notes.toLowerCase().includes(data.toLowerCase());
        });
        this.filteredHistory = filteredHistory.slice(filteredHistory.length - this.count, filteredHistory.length);
      }else {
        this.count += 10;
        this.filteredHistory = this.obj.table.slice(this.obj.table.length - this.count, this.obj.table.length);
      }
    },
    indexSnooze(index, time){
      this.reminderList[index].time = moment(this.reminderList[index].time, 'HH:mm').add(parseInt(time[0]), 'm').format('HH:mm');
      this.reminderFunc();
    },
    compReminder(index){
      this.reminderList[index].comp = true;
      this.reminderFunc();
    },
    deleteReminder(index){
      this.reminderList.splice(index,1);
      this.reminderFunc();
    },
    reminderFunc(){
    fs.readFile('reminder.json', 'utf8', (err, data) => {
        if (err) throw err;
        else {
          fs.writeFile('reminder.json', JSON.stringify(this.reminderList), 'utf8', err => {
            if (err) throw err;
          });
        }
      });
    },
    checkTime(){
      for(let i = 0; i < this.reminderList.length; i++){
        const element = this.reminderList[i];
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
                element.class = 'is-primary'
              }
            }
          break;
          default:
          if(moment(element.date, 'YYYY-MM-DD').isSameOrBefore()){
            element.class = 'is-danger';
          }else if(moment(element.date, 'YYYY-MM-DD').isSameOrAfter()){
            element.class = 'is-primary';
          }
        }
      }
      let end = moment().endOf('minute');
      let now = moment();
      let diff  = end.diff(now);
      setTimeout(this.checkTime, diff);
      this.reminderFunc();
    }
  },
  beforeMount() {
    this.mountReminder(false);
    this.mountTodo(false);
    this.mountHistory(false);
    this.user = process.env.DB_USER;
    this.checkTime();
  }
}
</script>

<style>
</style>