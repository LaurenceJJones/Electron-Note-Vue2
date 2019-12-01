<template>
  <div :class="['modal',{ 'is-active': this.$store.state.show.history}]">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">History</p>
      <button class="delete" aria-label="close" @click="close" ></button>
    </header>
    <section class="modal-card-body is-selectable" id="test" v-show="historys.length > 0">
      <cell v-for="(history, index) in historys.slice().reverse()" :key="index" type="is-success"><p>{{history.name}} - {{history.notes}} - {{history.date}}</p></cell>
    </section>
    <!-- <section class="modal-card-body" v-else>
      <p>No History To Show</p>
    </section> -->
    <footer class="modal-card-foot">
      <div class="field is-grouped">
        <p class="control is-expanded">
          <input class="input is-rounded" type="text" placeholder="Search" @keyup="search">
        </p>
      </div>
    </footer>
  </div>
</div>
</template>

<script>
import cell from './cell.vue'

export default {
  computed : {
    historys(){
      return this.$store.getters.historyFilter;
    }
  },
  components: {
    cell
  },
  methods: {
    close(){
      this.$store.commit('show','history');
      this.$store.commit('searchStr', '');
      document.getElementById('test').scrollTop = 0;
    },
    search(e){
      this.$store.commit('searchStr', e.target.value);
    },
    scroll(){
      var el = document.getElementById('test');
       el.onscroll = () => {
        let bottomOfWindow = el.clientHeight + el.scrollTop === el.scrollHeight;
        if (bottomOfWindow) {
          this.$store.commit('incCount');
        }
       }
    }
  },
  mounted(){
    this.scroll();
  }
}
</script>

<style>

</style>
