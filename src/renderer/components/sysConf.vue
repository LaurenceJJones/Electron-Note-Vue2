<template>
    <div :class="['modal',{ 'is-active': this.$store.state.show.conf}]" id="config">
        <div class="modal-background" @click="close"></div>
        <div class="modal-card is-unselectable">
            <header class="modal-card-head">
                <p class="modal-card-title">Config</p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <b-tabs type="is-boxed" expanded>
                    <b-tab-item label="System">
                        
                        <section>
                            <b-collapse v-for="(tag , index) in this.$store.state.config.quickTags" class="card" aria-id="contentIdForA11y3" :open="false" :key="index">
                                <div slot="trigger" slot-scope="props" class="card-header" role="button"
                                    aria-controls="contentIdForA11y3">
                                    <p class="card-header-title">
                                        {{tag.name}}
                                    </p>
                                </div>
                                <div class="card-content">
                                    <div class="content">
                                        {{tag.val}}
                                    </div>
                                </div>
                                <footer class="card-footer">
                                    <a class="card-footer-item">Save</a>
                                    <a class="card-footer-item">Edit</a>
                                    <a class="card-footer-item">Delete</a>
                                </footer>
                            </b-collapse>
                        </section>

                    </b-tab-item>
                    <b-tab-item label="Reminders">

                    </b-tab-item>
                    <b-tab-item label="WIP">

                    </b-tab-item>
                </b-tabs>
            </section>
            <footer class="modal-card-foot">
            </footer>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },
        methods: {
            close() {
                this.$store.commit('show', 'conf');
            }
        }
    }
</script>

<style>
</style>