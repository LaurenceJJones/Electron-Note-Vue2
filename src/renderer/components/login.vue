<template>
  <div class="card" style="margin: 20em auto;">
  <div class="card-content">
    <div class="content">
      <div class="container">
        <div class="field">
          <label class="label is-medium" >Login</label>
          <input class="input is-rounded is-medium" type="text" placeholder="Username" v-model="user">
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-rounded is-success is-medium" @click="setUser">Confirm</button>
          </div>
        </div>
      </div>
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
      this.$store.commit('userSet', this.user);
    }
  }
}
</script>

<style>
</style>
