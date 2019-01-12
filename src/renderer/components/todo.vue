<template>
<div :class="['modal',{ 'is-active': show}]">
  <div class="modal-background" @click="close"></div>
  <div class="modal-card is-unselectable">
    <header class="modal-card-head">
      <p class="modal-card-title">Todo List</p>
      <button class="delete" aria-label="close" @click="close"></button>
    </header>
    <section class="modal-card-body">
      <article :class="['message',{'is-link' :!todo.comp},{'is-danger' : todo.comp},'is-small']" v-for="(todo, index) in todoList" @click="compTodo(index)" v-if="!todo.comp && !showComp || showComp && todo.comp">
        <div class="message-body">
          {{todo.todo}}
        </div>
      </article>
    </section>
    <footer class="modal-card-foot">
      <div class="field is-grouped">
        <p class="control is-expanded">
          <input class="input is-rounded" type="text" placeholder="New Todo" v-model="todo">
        </p>
        <p class="control">
          <a class="button is-info" @click="addTodo">
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
  props: {
    todoList: Array,
    show: Boolean
  },
  data() {
    return {
      todo: '',
      showComp: false
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    addTodo() {
      if (this.todo) {
        this.$emit('newTodo', {
          todo: this.todo,
          comp: false
        });
        this.todo = '';
      }
    },
    compTodo(index){
      this.$emit('compTodo', index);
    }
  }
}
</script>

<style>
</style>
