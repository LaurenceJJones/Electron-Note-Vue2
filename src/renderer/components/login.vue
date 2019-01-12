<template>
  <div class="container">
    <div class="field">
      <label class="label">Login</label>
      <input class="input is-rounded" type="text" placeholder="Username" v-model="user">
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-rounded is-link" @click="setUser">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      user: ''
    }
  },
  methods: {
    setUser(){
      function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      this.user = cap(this.user)
      this.$emit('userSet', this.user);
    }
  }
}
</script>

<style>
</style>
