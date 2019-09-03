<template>
<div class="container">
  <nav class="panel is-unselectable">
    <p class="panel-heading is-lh2">
      Reminders
      <button class="button is-rounded is-primary is-pulled-right" @click="reminderShow">
        <p><i class="fas fa-calendar-plus"></i> New Remimder</p>
      </button>
    </p>
    <p class="panel-tabs is-center">
      <a :class="{'is-active': !showComp}" @click="showComp = false">Active ({{actNum}})</a>
      <a :class="{'is-active': showComp}" @click="showComp = true">Completed ({{compNum}})</a>
    </p>
    <p class="panel-tabs is-center">
      <a v-for="(date, index) in dates" :key="index" :class="{'is-active': date.active}" @click="dateActive(index)">{{date.day}}</a>
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
                <div class="control"><span class="icon is-medium has-text-success" @click="reminderComp(reminder.orgIndex)" v-if="!reminder.comp"><i class="fas fa-1x fa-check-square"></i></span></div>
                  <div class="control">
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

export default {
  props: ['reminders'],
  data() {
    return {
      showComp: false,
      selectedDay: null,
      count: 2,
      dates: [],
      selectSnooze: [],
      compNum: 0,
      actNum: 0
    }
  },
  computed: {
    filteredReminders(){
      let today = this.reminders.filter((reminder,index) => {
        reminder.orgIndex = index;
        return reminder.date === this.selectedDay;
      });
      let comp = 0;
      let i = today.map((reminder) => {
        if (reminder.comp === true){
          comp += 1;
        }
      });
      this.compNum = comp;
      this.actNum = today.length - comp;
      let filteredReminders = today.filter((reminder) => {
        return reminder.comp === this.showComp;
      });
      return filteredReminders
    }
  },
  methods: {
    dateActive(index) {
      for (let i = 0; i < this.dates.length; i++) {
        this.dates[i].active = false;
      }
      this.dates[index].active = true;
      this.selectedDay = this.dates[index].alt
    },
    reminderShow() {
      this.$emit('reminderShow');
    },
    datePush(){
      this.dates = [];
      for (let i = 1; i < this.count + 1; i++) {
        this.dates.unshift({
          'day': moment().subtract(i, 'days').format('ddd Do MMM'),
          'alt': moment().subtract(i, 'days').format('YYYY-MM-DD'),
          'active': false
        });
      }
      this.dates.push({
        'day': 'Today',
        'alt': moment().format('YYYY-MM-DD'),
        'active': true
      });
      for (let i = 1; i < this.count + 1; i++) {
        this.dates.push({
          'day': moment().add(i, 'days').format('ddd Do MMM'),
          'alt': moment().add(i, 'days').format('YYYY-MM-DD'),
          'active': false
        });
      }
      let end = moment().endOf('day').add(1, 'minute');
      let now = moment();
      let diff  = end.diff(now);
      this.selectedDay = moment().format('YYYY-MM-DD');
      setTimeout(this.datePush, diff);
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
    snooze(index){
      this.$emit('snoozeIndex', index, this.selectSnooze);
    },
    reminderComp(index){
        this.$emit('reminderComp', index);
      },
      reminderDelete(index){
        this.$emit('reminderDelete', index);
    }
  },
  beforeMount() {
    this.datePush();
  }
}
</script>

<style>
.field.is-grouped.is-pulled-right.reminder-icons{display:none;}
.message-body.reminder-slot:hover .field.is-grouped.is-pulled-right.reminder-icons{display: flex;}
.field.is-grouped.reminder-icons > .control {width: 47px;}
</style>
