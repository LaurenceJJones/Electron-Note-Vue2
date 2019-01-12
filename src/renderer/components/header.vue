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
      <li @click="naShow" :class="{'is-active' : naActive}">
        <a>
          <span class="icon is-small"><i class="fas fa-phone-slash"></i></span>
          <span>No Answer</span>
        </a>
      </li>
      <li @click="todoShow" :class="{'is-active' : todoActive}">
        <a>
          <span class="icon is-small"><i class="far fa-check-square"></i></span>
          <span>Todo List</span>
        </a>
      </li>
      <li>
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
  props: ['historyActive', 'naActive', 'todoActive'],
  methods: {
    historyShow() {
      this.$emit('historyShow');
    },
    naShow(){
      this.$emit('naShow');
    },
    todoShow(){
      this.$emit('todoShow');
    }
  }
}
</script>

<style>
</style>
