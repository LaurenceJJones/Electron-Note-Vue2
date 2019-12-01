<template>
  <div :class="['modal',{ 'is-active': this.$store.state.show.na}]">
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
          <div class="field" v-if="option2 === 'Will call back in'">
            <p class="control">
              <label class="label">Reminder?</label>
              <b-switch v-model="reminder"></b-switch>
            </p>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot is-block">
        <div class="field is-pulled-right" @click="copy">
          <div class="field-body">
            <div class="field">
              <div class="control">
                <button class="button is-success">
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
        option2: 'Asked to call back',
        reminder: false
      }
    },
    methods: {
      close() {
        this.custName = '';
        this.notes = '';
        this.mins = '';
        this.option1 = 'No';
        this.option2 = 'Asked to call back';
        this.reminder = false;
        this.$store.commit('show', 'na');
      },
      copy() {
        function cap(string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
        };
        if (this.custName) {
          this.custName = cap(this.custName);
          let date = moment().format("ddd Do MMM hh:mm");
          if (this.option1 === 'No') {
            clipboard.writeText(
              `${this.custName} : Could not get in contact no voicemail was left - ${date} - ${this.$store.state.config.user}`
            );
          } else {
            clipboard.writeText(
              `${this.custName} : Could not get in contact Voicemail was left - ${this.option2} ${this.mins ? `: ${typeof parseInt(this.mins) === 'number' ? `${this.mins}` : `ERROR`} - ${date} - ${this.$store.state.config.user} Will try again around - ${typeof parseInt(this.mins) === 'number' ? `${moment().add(parseInt(this.mins), 'm').format("hh:mm")}` : `ERROR`}` : `- ${date} - ${this.$store.state.config.user}`}`
            );
            this.reminder ? this.$store.dispatch('create', {
              loc: 'reminder',
              data: {
                'date': moment().format('YYYY-MM-DD'),
                'time': moment().add(parseInt(this.mins), 'm').format("hh:mm"),
                'customerName': cap(this.custName),
                'comp': false,
                'class': 'is-success'
              }
            }) : null;
          }
          this.close();
        }
      }
    }
  }
</script>

<style>
  #non-pad {
    margin-right: 0 !important;
  }
</style>