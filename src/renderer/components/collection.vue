<template>
  <div :class="['modal',{ 'is-active': show}]" id="coll">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card is-unselectable">
      <header class="modal-card-head">
        <p class="modal-card-title">Collections</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <template v-if="!edit" v-for="(collection, key, index) in collections">
          <collection-master :key="key" :index="index" :collection="collection" :theKey="key" @add="addName" @changeKey="changeKey"/>
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
    props: ['show'],
    data() {
      return {
        collections: {},
        edit: false
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      changeKey(newKey, oldKey){
            Object.defineProperty(this.collections, newKey,
                Object.getOwnPropertyDescriptor(this.collections, oldKey));
            delete this.collections[oldKey];
            this.edit = !this.edit;
            this.edit = !this.edit;
            this.writeColl();
      },
      addName(name , index){
        this.collections[index].push(name);
        this.writeColl();
      },
      addNew(){
        if (this.collections[""] === undefined){
          this.collections[""] = [];
        }
        this.edit = !this.edit;
        this.edit = !this.edit;
      },
      writeColl(){
        if (fs.existsSync('./collection.json')) {
          fs.readFile('collection.json', 'utf8', (err, data) => {
            if (err) throw err;
            else {
              fs.writeFile('collection.json', JSON.stringify(this.collections), 'utf8', err => {
                if (err) throw err;
              });
            }
          });
        }else {
          fs.writeFile('collection.json', JSON.stringify(this.collections), 'utf8', err => {
            if (err) throw err;
          });
        }
      },
      readColl(){
        if (fs.existsSync('./collection.json')) {
          fs.readFile('collection.json', 'utf8', (err, data) => {
            this.collections = JSON.parse(data);
          });
        }
      }
    },
    beforeMount(){
      this.readColl();
    }
  }
</script>