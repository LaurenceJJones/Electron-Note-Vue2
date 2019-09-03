<template>
  <div :class="['modal',{ 'is-active': show}]">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">Recent Notes</p>
      <button class="delete" aria-label="close" @click="close" ></button>
    </header>
    <section class="modal-card-body unsetheight">
      <cell v-for="(recent, index) in recentIndex.slice().reverse()" :key="index" :type="recent.type"  @click.native="restoreNote(recent, recent.orgIndex)"><p>{{recent.name}} - {{recent.notes}} - {{recent.date}}</p></cell>
    </section>
    <footer class="modal-card-foot">
      <p class="modal-card">Click To Restore Note</p>
   </footer>
  </div>
</div>
</template>

<script>
import cell from './cell.vue'
export default {
  props:{
    recents : Array,
    show : Boolean
  },
  components: {
    cell
  },
    computed: {
    recentIndex(){
      let i = this.recents.map((recent,index) => {
        recent.orgIndex = index;
        return recent
      });
      return i
    }
  },
  methods: {
    close(){
      this.$emit('close', false);
    },
    restoreNote(data, index){
      this.$emit('restoreNote', data , index);
      this.close()
    }
  }
}
</script>

<style>
</style>
