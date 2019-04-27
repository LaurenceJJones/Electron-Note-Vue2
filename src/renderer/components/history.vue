<template>
  <div :class="['modal',{ 'is-active': show}]">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">History</p>
      <button class="delete" aria-label="close" @click="close" ></button>
    </header>
    <section class="modal-card-body is-selectable" id="test" v-show="historys.length > 0">
      <cell v-for="(history, index) in historys.slice().reverse()" :key="index" type="is-primary"><p>{{history.name}} - {{history.notes}} - {{history.date}}</p></cell>
    </section>
    <!-- <section class="modal-card-body" v-else>
      <p>No History To Show</p>
    </section> -->
    <footer class="modal-card-foot">
      <div class="field is-grouped">
        <p class="control is-expanded">
          <input class="input is-rounded" type="text" placeholder="Search" v-model="searchTerm" @keyup="search">
        </p>
      </div>
    </footer>
  </div>
</div>
</template>

<script>
import cell from './cell.vue'

export default {
  data(){
    return {
      searchTerm: ""
    }
  },
  props:{
    historys : Array,
    show : Boolean
  },
  components: {
    cell
  },
  methods: {
    close(){
      this.$emit('close');
      this.searchTerm = '';
      document.getElementById('test').scrollTop = 0;
    },
    search(){
      this.$emit('filterHistory', this.searchTerm)
    },
    scroll(){
      var el = document.getElementById('test');
       el.onscroll = () => {
        let bottomOfWindow = el.clientHeight + el.scrollTop === el.scrollHeight;
        if (bottomOfWindow) {
          this.$emit('countInc', this.searchTerm)
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
