<template>
<!-- <div class="box">
  <article class="media">
    <div class="media-content">
      <div class="content"> -->
        <article :class="['message', type]">
          <div class="message-body">
            <slot></slot>
          </div>
        </article>
      <!-- </div>
    </div>
  </article>
</div> -->
</template>

<script>
export default {
    props:['type']
}
</script>

<style>
</style>
