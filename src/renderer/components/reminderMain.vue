<template>
<div class="container">
  <nav class="panel is-unselectable">
    <p class="panel-heading is-lh2">
      Reminders
      <button class="button is-rounded is-success is-pulled-right" @click="reminderShow">
        <p><i class="fas fa-calendar-plus"></i> New Reminder</p>
      </button>
    </p>
    <p class="panel-tabs is-center">
      <a :class="{'is-active': !this.$store.state.showComp}" @click="showComp(false)">Active <b-tag rounded>{{this.$store.getters.filteredReminders.act}}</b-tag></a>
      <a :class="{'is-active': this.$store.state.showComp}" @click="showComp(true)">Completed <b-tag rounded>{{this.$store.getters.filteredReminders.comp}}</b-tag></a>
    </p>
    <p class="panel-tabs is-center">
      <a v-for="(date, index) in days" :key="index" :class="{'is-active': date.active}" @click="dateActive(date.alt)">{{date.day}} <b-tag rounded>{{date.tot}}</b-tag></a>
    </p>
    <div class="panel-block">
      <div class="content">
        <transition-group
            enter-active-class="animated bounceInLeft"
            leave-active-class="animated bounceOutRight"
            mode="in-out"
          >
          <article v-for="reminder in filteredReminders" :class="['message', reminder.class]" :key="reminder.time">
            <div class="message-body reminder-slot has-text-black">{{reminder.customerName}} - {{reminder.time}}
              <div class="field is-grouped is-pulled-right reminder-icons">
                <div class="control"><span class="icon is-medium has-text-success" @click="reminderComp(reminder.orgIndex)" v-show="!reminder.comp"><i class="fas fa-1x fa-check-square"></i></span></div>
                  <div class="control"  v-show="!reminder.comp">
                    <span class="icon is-medium has-text-warning" @click="stopwatch"><i class="fas fa-1x fa-stopwatch"></i></span>
                    <div class="select is-multiple"  style="display:none;">
                      <select multiple size="4" @mouseleave.self="showStop" @click="snooze(reminder.orgIndex)" v-model="selectSnooze">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                  </div>
                <div class="control"><span class="icon is-medium has-text-danger" @click="reminderDelete(reminder.orgIndex)"><i class="fas fa-1x fa-times-circle"></i></span></div>
              </div>
            </div>
          </article>
        </transition-group>
      </div>
    </div>
  </nav>
</div>
</template>

<script>
const moment = require('moment');
  import {
    Datepicker
  } from 'buefy/dist/components/datepicker'

export default {
  data() {
    return {
      selectSnooze: [],
    }
  },
  computed: {
    days(){
      return this.$store.getters.getDays;
    },
    filteredReminders(){
      return this.$store.getters.filteredReminders.data;
    }
  },
  methods: {
    showComp(payload){
      this.$store.commit('editKey', {
        loc : 'showComp',
        val : payload
      })
    },
    dateActive(payload){
      this.$store.commit('editKey', {
        loc : 'selectedDay',
        val : payload
      })
    },
    reminderShow() {
      this.$store.commit('show','reminder');
    },
    stopwatch(e){
      if (e.target.className === "fas fa-1x fa-stopwatch"){
        e.target.parentElement.nextElementSibling.style.display = "inline-flex";
        e.target.parentNode.style.display = "none";
      }else{
        e.target.nextElementSibling.style.display = "inline-flex";
        e.target.style.display = "none";
      }
    },
    showStop(e){
      e.target.parentNode.previousElementSibling.style.display = "inline-flex";
      e.target.parentNode.style.display = "none";
      this.selectSnooze = [];
    },
    snooze(orgIndex){
      this.$store.dispatch('modify',{
          loc : 'reminder',
          orgIndex,
          key : 'time',
          val : moment(this.$store.state.files.reminder[orgIndex].time, 'HH:mm').add(parseInt(this.selectSnooze[0]), 'm').format('HH:mm'),
          type : 'put'
      });
    },
    reminderComp(orgIndex){
      this.$store.dispatch('modify',{
          loc : 'reminder',
          orgIndex,
          key : 'comp',
          val : true,
          type : 'put'
      });
      },
      reminderDelete(orgIndex){
      this.$store.dispatch('delete',{
          loc : 'reminder',
          orgIndex,
      });
    }
  }
}
</script>

<style>
.field.is-grouped.is-pulled-right.reminder-icons{display:none;}
.message-body.reminder-slot:hover .field.is-grouped.is-pulled-right.reminder-icons{display: flex;}
.field.is-grouped.reminder-icons > .control {width: 47px;}
</style>
