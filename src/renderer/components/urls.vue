<template>
<div :class="['modal',{ 'is-active': this.$store.state.show.urls}]" id="sb">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">URLS</p>
      <button class="delete" aria-label="close" @click="close"></button>
    </header>
    <section class="modal-card-body">
      <section class="section">
        <div v-html="urls"></div>
      </section>
    </section>
    <footer class="modal-card-foot">
    </footer>
  </div>
</div>
</template>
<script>
const fs = require('fs');
export default {
  data: () => ({
    urls : ''
  }),
  methods: {
    close(){
      this.$store.commit('show','urls');
    }
  },
  beforeMount(){
    if (fs.existsSync('./urls.txt')) {
        fs.readFile('urls.txt', 'utf8', (err, data) => {
          data = data.replace('\n','</p> <p>').split(' ');
          data.splice(0, 1);
          data = data.join(' ');
          this.urls = data;
        });
    }
  }
}
</script>
<style>

</style>
