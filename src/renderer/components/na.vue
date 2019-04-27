<template>
<div :class="['modal',{ 'is-active': show}]">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card  is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">No Answer</p>
      <button class="delete" aria-label="close" @click="close"></button>
    </header>
    <section class="modal-card-body">
      <div class="field">
        <label class="label">Customer Name</label>
        <div class="control">
          <input class="input is-rounded" type="text" placeholder="Customer Name" v-model="custName">
        </div>
      </div>
      <div class="field">
        <label class="label">Did you leave a message?</label>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <div class="select">
                <select v-model="option1">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </p>
          </div>
        </div>
      </div>
      <div v-if="option1 === 'Yes'">
        <div class="field">
          <label class="label">Message was?</label>
          <div class="field-body">
            <div class="field is-grouped">
              <p class="control " id="non-pad">
                <div class="select">
                  <select v-model="option2">
                    <option>Asked to call back</option>
                    <option>Will call back in</option>
                  </select>
                </div>
              </p>
              <p class="control" v-if="option2 === 'Will call back in'">
                <input class="input is-rounded is-info" type="text" placeholder="Mins" v-model="mins">
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot is-block">
      <div class="field is-pulled-right" @click="copy">
        <div class="field-body">
          <div class="field">
            <div class="control">
              <button class="button is-primary">
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>
</template>
<script>
const {
  clipboard
} = require('electron');
const moment = require('moment');
export default {
  data() {
    return {
      custName: '',
      mins: '',
      option1: 'No',
      option2: 'Asked to call back'
    }
  },
  props: ['show','user'],
  methods: {
    close() {
      this.custName = '';
      this.notes = '';
      this.mins = '';
      this.option1 = 'No';
      this.option2 = 'Asked to call back';
      this.$emit('close');
    },
    copy(){
      function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      if (this.custName){
        this.custName = cap(this.custName);
        let date = moment().format("ddd Do MMM hh:mm");
        if (this.option1 === 'No'){
          clipboard.writeText( this.custName + " : Could not get in contact no voicemail was left - " + date + " - " + this.user);
        }else {
          if (this.option2 === 'Asked to call back'){
            clipboard.writeText( this.custName + " : Could not get in contact Voicemail was left - " + this.option2 + " - " + date + " - " + this.user);
          }else {
            if (this.mins){
              clipboard.writeText( this.custName + " : Could not get in contact Voicemail was left - " + this.option2 + ": " + this.mins + " - " + date + " - " + this.user + " Will try again around - " + moment().add(parseInt(this.mins), 'm').format("hh:mm") );
            }else{
              clipboard.writeText( this.custName + " : Could not get in contact Voicemail was left - " + this.option2 + " - " + date + " - " + this.user);
            }
          }
        }
        this.close();
      }
    }
  }
}
</script>

<style>
#non-pad{
  margin-right: 0 !important;
}
</style>
