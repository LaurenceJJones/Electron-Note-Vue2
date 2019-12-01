<template>
<div :class="['modal',{ 'is-active': this.$store.state.show.reminder}]">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">New Reminder</p>
      <button class="delete" aria-label="close" @click="close"></button>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">Customer Name</label>
        <div class="control">
          <input class="input" type="text" placeholder="Name" v-model="customerName">
        </div>
      </div>
      <label class="label">When?</label>
      <div class="field is-grouped">
        <p class="control " id="non-pad">
          <input class="input" type="time" v-model="currentTime">
        </p>
        <p class="control">
          <input class="input" type="date" v-model="currentDate">
        </p>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-rounded is-success is-pulled-right" @click="addReminder">
        <p>Add Reminder</p>
      </button>
    </footer>
  </div>
</div>
</template>
<script>
const moment = require('moment');

export default {
  data() {
    return {
      currentDate: null,
      currentTime: null,
      customerName: ''
    }
  },
  watch: {
    check(){
      this.currentTime = moment().format('HH:mm');
      this.currentDate = moment().format('YYYY-MM-DD');
    }
  },
  computed :{
    check(){
      return this.$store.state.show.reminder;
    }
  },
  methods: {
    close() {
      this.customerName = '';
      this.$store.commit('show', 'reminder');
    },
    addReminder(){
      if (this.customerName){
        this.$store.dispatch('create',{
          loc : 'reminder',
          data : {
            'date': this.currentDate,
            'time': this.currentTime,
            'customerName': this.customerName,
            'comp' : false,
            'class': 'is-success'
          }
        });
        this.close();
      }
    }
  }
}
</script>
<style>
</style>
