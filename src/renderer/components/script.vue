<template>
    <div :class="['modal',{ 'is-active': this.$store.state.show.script}]" id="sb">
        <div class="modal-background" @click="close"></div>
        <div class="modal-card is-unselectable">
            <header class="modal-card-head">
                <p class="modal-card-title">Script Builder</p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="tile">
                    <div class="tile is-parent">
                        <div class="tile is-child is-6">
                              <p class="panel-heading">
                                  <a @click="setSnip('')"><i class="fas fa-chevron-left"></i> {{this.$store.state.scriptKey}}</a>
                                    <div class="dropdown is-hoverable is-pulled-right">
                                        <div class="dropdown-trigger">
                                            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                                            <span>Insert</span>
                                            <span class="icon is-small">
                                                <i class="fas fa-angle-down" aria-hidden="true"></i>
                                            </span>
                                            </button>
                                        </div>
                                        <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                                            <div class="dropdown-content">
                                                <div class="dropdown-item" @click="insert('deleted')">
                                                    <p>Deleted</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </p>
                                <div class="panel is-clipped">
                                    <a class="panel-block" v-for="(snip, key) in filteredSnippets" @click="setSnip(key)" :key="key">
                                        <span class="panel-icon"><i :class="['fas',  {'fa-database': !snip.script},{'fa-file-code': snip.script}]" aria-hidden="true"></i></span>
                                        <p>{{key}}</p>
                                    </a>
                                </div>
                        </div>
                        <div class="tile is-child is-6">
                            <div class="box">
                                <textarea class="textarea is-medium has-fixed-size" v-model="script"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot is-inline-block">
                <input class="input is-rounded" type="text" placeholder="Search">
                <div class="is-pulled-right">
                    <input class="input is-rounded" type="text" v-model="saveName">
                    <button class="button is-success" @click="saveSnip">Save - <span v-if="this.$store.state.scriptKey">Script</span><span v-else>Table</span></button>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
const fs = require('fs');
    export default {
        //REPLACE ALL I_invno WITH STRTRAN(I_invno,"INV", "CNC")
        //todo add an insert dropdown menu so users can insert certain script elements - deleted - replace - replace string with part strings
        // use customer in 0
        // SELECT customer
        // SET DELETED OFF
        // ACTIVATE SCREEN
        // BROWSE
        // SET DELETED ON
        // USE IN customer
        data() {
            return {
                saveName: '',
            }
        },
        computed : {
            filteredSnippets(){
                return this.$store.getters.filteredScripts
            },
            script:{
                get: function(){
                    return this.$store.state.script
                },
                set: function(e){
                    this.$store.commit('editKey', {
                        loc : 'script',
                        val : e
                    });
                }
            }
        },
        methods: {
            close() {
                this.$store.commit('show','script');                        
                this.$store.commit('editKey', {
                    loc : 'script',
                    val : ''
                });
            },
            copy() {

            },
            setSnip(key){
                if (key){
                    if (this.filteredSnippets[key].script){
                        this.$store.commit('editKey', {
                            loc : 'script',
                            val : this.filteredSnippets[key].script
                        });
                        return;
                    }
                }
                this.$store.commit('editKey', {
                    loc : 'scriptKey',
                    val : key
                });
            },
            saveSnip(){
                if (this.$store.state.scriptKey && this.saveName.length > 0 && this.saveName !== 'script'){
                    this.$store.dispatch('modify',{
                        loc : 'scripts',
                        orgIndex : 0,
                        key : this.$store.state.scriptKey,
                        subKey : this.saveName,
                        val : { script : this.$store.state.script},
                        type : 'put'
                    });
                    this.setSnip('');
                    this.saveName = '';
                }else{
                    if (this.saveName.length > 0 && this.saveName !== 'script'){
                        this.$store.dispatch('modify',{
                            loc : 'scripts',
                            orgIndex : 0,
                            key : this.saveName,
                            val : {},
                            type : 'put'
                        });
                        this.setSnip(this.saveName);
                        this.saveName = '';
                    }
                }
            },
            insert(method){
                if (this.$store.state.script.length > 0 && this.$store.state.scriptKey){
                    let eachLine = this.$store.state.script.split('\n');
                    for (let i = 0; i < eachLine.length; i++) {
                        const element = eachLine[i];
                        if (element === ""){
                            eachLine.splice(i, 1);
                        }
                    }
                    switch (method) {
                    case 'deleted':
                        if (eachLine.length > 2){
                            eachLine.splice(2, 0, 'SET DELETED OFF \nACTIVATE SCREEN');
                            eachLine.splice(eachLine.length, 0, `SET DELETED ON \nUSE IN ${this.$store.state.scriptKey}`);
                        }
                        break;
                    }
                    eachLine = eachLine.join('\n');
                        this.$store.commit('editKey', {
                            loc : 'script',
                            val : eachLine
                        });
                    }
                }
        }
    }
</script>

<style>
</style>