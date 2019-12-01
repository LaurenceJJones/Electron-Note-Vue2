<template>
  <div :class="['modal',{ 'is-active': this.$store.state.show.collection}]" id="coll">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card is-unselectable">
      <header class="modal-card-head">
        <p class="modal-card-title">Collections</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <template v-for="(collection, index) in collections">
          <collection-master :key="index" :collection="collection" :index="index"/>
        </template>
      </section>
    <footer class="modal-card-foot">
      <span :class="['icon','is-large','has-text-success']" @click="addNew">
        <i class="fas fa-2x fa-plus-circle"></i>
      </span>
    </footer>
    </div>
  </div>
</template>
<script>
const fs = require('fs');

import collectionMaster from './collectionMaster.vue';

  export default {
    components:{
      collectionMaster
    },
    computed: {
      collections(){
        return this.$store.state.files.collection;
      }
    },
    methods: {
      close() {
        this.$store.commit('show','collection');
      },
      addNew(){
          this.$store.dispatch('create', {
              loc : 'collection',
              data : {
                  key : '',
                  names : []
              }
          });
      }
  }
  }
</script>