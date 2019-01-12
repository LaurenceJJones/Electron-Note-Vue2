<template>
  <div :class="['modal',{ 'is-active': show}]">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">History</p>
      <button class="delete" aria-label="close" @click="close" ></button>
    </header>
    <section class="modal-card-body unsetheight">
      <cell v-if="historys.length > 0" v-for="(history, index) in historys.slice().reverse()" :key="index"><p>{{history.name}} - {{history.notes}} - {{history.date}}</p></cell>
      <p v-else>no historys</p>
    </section>
  </div>
</div>
</template>

<script>
import cell from './cell.vue'

export default {
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
    },
  }
}
</script>

<style>

</style>
