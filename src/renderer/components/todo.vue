<template>
  <div :class="['modal',{ 'is-active': this.$store.state.show.todo}]">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card is-unselectable">
      <header class="modal-card-head">
        <p class="modal-card-title">Todo List</p>
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <transition-group enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight"
          mode="out-in">
          <article :class="['message',{'is-success' :!todo.comp},{'is-danger' : todo.comp},'is-small']"
            v-for="(todo) in todoList" @click="compTodo(todo.orgIndex)"  :key="todo.todo">
            <div class="message-body" >
              {{todo.todo}}
            </div>
          </article>
        </transition-group>
      </section>
      <footer class="modal-card-foot">
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input class="input is-rounded" type="text" placeholder="New Todo" v-model="todo">
          </p>
          <p class="control">
            <a class="button is-success" @click="addTodo">
              Add New
            </a>
          </p>
        </div>
        <div class="container">
          <div class="tabs is-boxed">
            <ul>
              <li :class="{'is-active': !showComp}" @click="showComp = false">
                <a>
                  <span class="icon is-small"><i class="fas fa-clipboard-list" aria-hidden="true"></i></span>
                  <span>Ongoing</span>
                </a>
              </li>
              <li :class="{'is-active': showComp}" @click="showComp = true">
                <a>
                  <span class="icon is-small"><i class="fas fa-check-double" aria-hidden="true"></i></span>
                  <span>Completed</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        todo: '',
        showComp: false
      }
    },
    computed: {
      todoList() {
        let filterTodo = this.$store.state.files.todo.filter((todo , index) => {
          todo.orgIndex = index;
          return todo.comp === this.showComp;
        });
        return filterTodo;
      }
    },
    methods: {
      close() {
        this.$store.commit('show', 'todo');
      },
      addTodo() {
        if (this.todo) {
          this.$store.dispatch('create', {
            loc: 'todo',
            data: {
              todo: this.todo,
              comp: false
            }
          });
          this.todo = '';
        }
      },
      compTodo(orgIndex) {
        this.$store.dispatch('modify', {
          loc : 'todo',
          orgIndex,
          key : 'comp',
          val : true,
          type : 'put'
        });
      }
    }
  }
</script>

<style>
</style>