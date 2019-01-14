<template>
  <div>
      <user-top :user="user" @resetUser="resetUser"></user-top>
      <section class="section" v-if="check">
        <login @userSet="userSet"></login>
      </section>
      <section class="section" v-else>
        <form-top @historyMount="mountHistory" :user="user"></form-top>
        <reminder-main @reminderShow="showReminder" :reminders="reminderList"></reminder-main>
      </section>
      <new-reminder :show="reminderShow" @close="showReminder" @addReminder="mountReminder"></new-reminder>
      <na :show="naShow" @close="showNA" :user="user"></na>
      <todo :show="todoShow" @close="showTodo" :todoList="todoList" @newTodo="mountTodo" @compTodo="compTodo"></todo>
      <history :show="historyShow"  @close="showHistory" :historys="obj.table"></history>
      <nav-bottom
      @naShow="showNA" @historyShow="showHistory" @todoShow="showTodo"
      :historyActive="historyShow" :naActive="naShow" :todoActive="todoShow"
      ></nav-bottom>
  </div>
</template>

<script>
import navBottom from './components/header.vue';
import userTop from './components/user.vue'
import formTop from './components/form.vue';
import login from './components/login.vue';
import history from './components/history.vue';
import na from './components/na.vue';
import todo from './components/todo.vue';
import reminderMain from './components/reminderMain.vue';
import newReminder from './components/reminder.vue';

const fs = require('fs');
const moment = require('moment');
const Store = require('electron-store');
const store = new Store({
  defaults: {
    userName: {
      un: ''
    }
  }
});
export default {
  data(){
    return{
      user: null,
      historyShow : false,
      naShow : false,
      todoShow : false,
      reminderShow: false,
      obj : {"table":[]},
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
    newReminder
  },
  computed : {
    check(){
      if (this.user){
        return false
      }else{
        return true
      }
    }
  },
  methods:{
    userSet(data){
      this.user = data;
      store.set('userName.un', data);
    },
    showTodo(){
      this.todoShow = !this.todoShow;
    },
    showNA(){
      this.naShow = !this.naShow;
    },
    showHistory(){
      this.historyShow = !this.historyShow;
    },
    showReminder(){
      this.reminderShow = !this.reminderShow;
    },
    mountHistory(data){
      if (data){
        this.obj.table.push(data);
      }else {
        if (fs.existsSync('./history.json')) {
          fs.readFile('history.json', 'utf8', (err, data) => {
            this.obj = JSON.parse(data);
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
          fs.readFile('reminder.json', 'utf8', (err, data) => {
            if (err) throw err;
            else {
              fs.writeFile('reminder.json', JSON.stringify(this.reminderList), 'utf8', err => {
                if (err) throw err;
              });
            }
          });
        } else {
          fs.writeFile('reminder.json', JSON.stringify(this.reminderList), 'utf8', err => {
            if (err) throw err;
          });
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
      store.set('userName.un', '');
    },
    compTodo(index){
      this.todoList[index].comp = !this.todoList[index].comp;
      this.writeTodo();
    }
  },
  beforeMount() {
    this.mountReminder(false);
    this.mountTodo(false);
    this.mountHistory(false);
    this.user = store.get('userName.un');
  }
}
</script>

<style>
html, body {
  height:100%;
}
::-webkit-scrollbar{
  display: none;
}
.panel-block{
    height: 400px;
    overflow: hidden;
    overflow-y: scroll;
    display: block !important;
}
.modal-card-body {
  height: 300px;
}
.unsetheight {
  height: unset !important;
}
.is-center{
  text-align: center;
  justify-content: center;
}
.is-selectable{
  user-select: text;
}
@media screen and (min-width: 1088px){
  .navbar, .navbar-menu, .navbar-start, .navbar-end{
    display: block !important;
  }
}
.input, .textarea{
  width: unset !important;
}
.field.is-grouped{
  margin-right: 15px;
}

</style>
