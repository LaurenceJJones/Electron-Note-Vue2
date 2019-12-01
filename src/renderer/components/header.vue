<template>
<nav class="navbar is-light is-fixed-bottom" role="navigation" aria-label="main navigation">
  <div class="tabs is-toggle is-toggle-rounded is-centered">
    <ul>
      <li @click="historyShow" :class="{'is-active' : this.$store.state.show.history}">
        <a>
          <span class="icon is-small"><i class="fas fa-history"></i></span>
          <span>History</span>
        </a>
      </li>
      <li @click="todoShow" :class="{'is-active' : this.$store.state.show.todo}">
        <a>
          <span class="icon is-small"><i class="far fa-check-square"></i></span>
          <span>Todo List</span>
        </a>
      </li>
      <li @click="collectionShow" :class="{'is-active' : this.$store.state.show.collection}">
        <a>
          <span class="icon is-small"><i class="fas fa-list-ol"></i></span>
          <span>Collections</span>
        </a>
      </li>
      <li @click="scriptShow" :class="{'is-active' : this.$store.state.show.script}">
        <a>
          <span class="icon is-small"><i class="fas fa-cogs"></i></span>
          <span>Script Builder</span>
        </a>
      </li>
      <li  @click="urlsShow" :class="{'is-active' : this.$store.state.show.urls}">
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
  methods: {
    historyShow() {
      this.$store.commit('show','history');
    },
    todoShow(){
      this.$store.commit('show','todo');
    },
    scriptShow(){
      this.$store.commit('show','script');
    },
    collectionShow(){
      this.$store.commit('show','collection');
    },
    urlsShow(){
      this.$store.commit('show','urls');
    }
  }
}
</script>

<style>
</style>
