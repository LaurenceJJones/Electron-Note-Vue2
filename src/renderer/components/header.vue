<template>
<nav class="navbar is-light is-fixed-bottom" role="navigation" aria-label="main navigation">
  <div class="tabs is-toggle is-toggle-rounded is-centered">
    <ul>
      <li @click="historyShow" :class="{'is-active' : historyActive}">
        <a>
          <span class="icon is-small"><i class="fas fa-history"></i></span>
          <span>History</span>
        </a>
      </li>
      <li @click="todoShow" :class="{'is-active' : todoActive}">
        <a>
          <span class="icon is-small"><i class="far fa-check-square"></i></span>
          <span>Todo List</span>
        </a>
      </li>
      <li @click="collectionShow" :class="{'is-active' : collectionActive}">
        <a>
          <span class="icon is-small"><i class="fas fa-list-ol"></i></span>
          <span>Collections</span>
        </a>
      </li>
      <li @click="scriptShow" :class="{'is-active' : scriptActive}">
        <a>
          <span class="icon is-small"><i class="fas fa-cogs"></i></span>
          <span>Script Builder</span>
        </a>
      </li>
      <li  @click="urlsShow" :class="{'is-active' : urlsActive}">
        <a>
          <span class="icon is-small"><i class="far fa-file-alt"></i></span>
          <span>URLS</span>
        </a>
      </li>
    </ul>
  </div>
</nav>
</template>
<script>
export default {
  props: ['historyActive','todoActive','scriptActive', 'collectionActive', 'urlsActive'],
  methods: {
    historyShow() {
      this.$emit('historyShow');
    },
    todoShow(){
      this.$emit('todoShow');
    },
    scriptShow(){
      this.$emit('scriptShow');
    },
    collectionShow(){
      this.$emit('collectionShow');
    },
    urlsShow(){
      this.$emit('urlsShow');
    }
  }
}
</script>

<style>
</style>
