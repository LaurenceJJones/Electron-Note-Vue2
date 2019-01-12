<template>
<div class="container">
  <nav class="panel is-unselectable">
    <p class="panel-heading">
      Reminders {{selectedDay}}
      <button class="button is-rounded is-link  is-pulled-right" @click="reminderShow">
        <p>New Remimder</p>
      </button>
    </p>
    <p class="panel-tabs is-center">
      <a :class="{'is-active': !showComp}" @click="showComp = false">Active</a>
      <a :class="{'is-active': showComp}" @click="showComp = true">Completed</a>
    </p>
    <p class="panel-tabs is-center">
      <a v-for="(date, index) in dates" :key="index" :class="{'is-active': date.active}" @click="dateActive(index)">{{date.day}}</a>
    </p>
    <div class="panel-block">
      <div class="content">
        <article v-for="(reminder, index) in reminders" :class="['message', colour(reminder.time)]" v-if="reminder.date === selectedDay" :key="index">
          <div class="message-body">{{reminder.customerName}} - {{reminder.time}}</div>
        </article>
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
      selectedDay: moment().format('YYYY-MM-DD'),
      count: 2,
      dates: []
    }
  },
  methods: {
    colour(time){
      let currentTime = moment().format('HH:mm');
      console.log(moment(time).isBefore(currentTime));
      if (moment(time).isAfter(currentTime, 'minute')){
        return  'is-danger'
      }else{
        return  'is-info'
      }
    },
    dateActive(index) {
      for (let i = 0; i < this.dates.length; i++) {
        this.dates[i].active = false;
      }
      this.dates[index].active = true;
      this.selectedDay = this.dates[index].alt
    },
    reminderShow() {
      this.$emit('reminderShow');
    }
  },
  beforeMount() {
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
  }
}
</script>

<style>

</style>
