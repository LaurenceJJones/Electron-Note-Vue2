<template>
  <div class="dropdown is-hoverable is-right is-pulled-right">
    <div class="dropdown-trigger">
      <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
        <p><i class="fas fa-user-circle"></i> {{user}}</p>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <!-- <div class="dropdown-item">
          <a class="button is-info is-rounded is-outlined">System Config</a>
        </div> -->
        <div class="dropdown-item">
          <hr class="dropdown-divider">
          <a class="button is-danger is-rounded is-outlined" @click="resetUser">Reset User</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const fs = require('fs');
export default {
  data: () => ({

  }),
  props: ['user'],
  methods: {
    resetUser(){
      this.$emit('resetUser');
    }
  }
}
</script>

<style>
</style>
