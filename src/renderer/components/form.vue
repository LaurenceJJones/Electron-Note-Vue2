<template>
<div class="container">
  <div class="field">
    <label class="label is-unselectable">Customer Name</label>
    <div class="control">
      <input class="input is-rounded" type="text" placeholder="Customer Name" v-model="custName" @keyup.enter="setFocus">
    </div>
  </div>
  <div class="field">
    <label class="label is-unselectable">Notes</label>
    <div class="control">
      <textarea id="note" class="textarea has-fixed-size" type="text" placeholder="Notes" v-model="notes" @keyup.enter.shift="copy" @keyup.enter.ctrl="clear(true)"></textarea>
    </div>
  </div>
  <div class="field is-grouped">
    <div class="control">
      <button class="button is-rounded is-link" @click="copy"><p><i class="far fa-clipboard"></i> Copy</p></button>
    </div>
    <div class="control">
      <button class="button is-rounded is-danger" @click="clear(true)"><p><i class="fas fa-times"></i> Clear</p></button>
    </div>
    <div class="control">
      <button class="button is-rounded is-info" @click="showClick" v-if="!restored"><p><i class="far fa-list-alt"></i> Recent Notes</p></button>
      <button class="button is-rounded is-success" v-else>Restored Note {{indexRestored + 1}}</button>
    </div>
  </div>
  <recentApp @restoreNote="restoreNote" @close="showClick" :show="show" :recents="recent"></recentApp>
</div>
</template>

<script>
const {
  clipboard
} = require('electron');
const moment = require('moment');
const fs = require('fs');

import recentApp from './recent.vue'

export default {
  data() {
    return {
      custName: '',
      notes: '',
      obj: {
        table : []
      },
      show : false,
      recent: [],
      restored : false,
      indexRestored: null
    }
  },
  props: ['user'],
  components:{
    recentApp
  },
  methods: {
    clear(bool) {
      if (bool){
        if(this.custName && this.notes){
          this.capNow();
          this.recentPush(moment().format('ddd Do MMM hh:mm'),'is-danger');
        }
      }
      this.custName = '';
      this.notes = '';
    },
    copy() {
      if (this.custName && this.notes){
        this.capNow();
        let format = moment().format('ddd Do MMM hh:mm');
        clipboard.writeText(this.custName + ' - ' + this.notes + ' - ' + format + ' - ' + this.user);
        this.storage(format)
      }
    },
    storage(format) {
      if (fs.existsSync('./history.json')) {
        fs.readFile('history.json', 'utf8', (err, data) => {
          if (err) throw err;
          else {
            this.obj = JSON.parse(data);
            this.objPush(format);
            fs.writeFile('history.json', JSON.stringify(this.obj), 'utf8', err => {
              if (err) throw err;
              this.$emit('historyMount',{
                name: this.custName,
                notes: this.notes,
                date: format
              });
              this.clear(false);
            });
          }
        });
      } else {
        this.objPush(format);
        fs.writeFile('history.json', JSON.stringify(this.obj), 'utf8', err => {
          if (err) throw err;
          this.$emit('historyMount',{
            name: this.custName,
            notes: this.notes,
            date: format
          });
          this.clear(false);
        });
      }
    },
    objPush(format) {
      this.obj.table.push({
        name: this.custName,
        notes: this.notes,
        date: format
      });
      this.recentPush(format,'is-info');
    },
    recentPush(format, type){
      if (this.restored){
        this.recent.splice(this.indexRestored,1,{
          name: this.custName,
          notes: this.notes,
          date: format,
          type: type
        });
        this.restored = false;
      }else {
          if (this.recent.length > 4){
            this.recent.splice(0,1);
            this.recent.push({
              name: this.custName,
              notes: this.notes,
              date: format,
              type: type
            });
          }else {
          this.recent.push({
            name: this.custName,
            notes: this.notes,
            date: format,
            type: type
          });
        }
      }
    },
    showClick(){
      this.show = !this.show;
    },
    restoreNote(data, index){
      this.custName = data.name;
      this.notes = data.notes;
      this.indexRestored = index;
      this.restored = true;
    },
    capNow(){
      function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      this.custName = cap(this.custName);
      this.notes = cap(this.notes);
    },
    setFocus(){
      document.getElementById('note').focus();
    }
  }
}
</script>

<style>
</style>
