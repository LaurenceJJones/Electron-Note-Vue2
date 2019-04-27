<template>
    <div :class="['modal',{ 'is-active': show}]" id="sb">
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
                                  <a @click="setSnip(prev.key,prev.snip,true)"><i class="fas fa-chevron-left"></i> {{prev.key}}</a>
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
                                    <a class="panel-block" v-for="(snip, key) in filteredSnippets" @click="setSnip(key,snip,false)" :key="key">
                                        <span class="panel-icon"><i :class="['fas', {'fa-database': !prev.key},{'fa-file-code': prev.key}]" aria-hidden="true"></i></span>
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
                    <button class="button is-primary" @click="saveSnip">Save - <span v-if="this.prev.key">Script</span><span v-else>Table</span></button>
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
        props: ['show'],
        data() {
            return {
                script: '',
                saveName: '',
                filteredSnippets:{},
                prev: {
                    key: '',
                    snip: ''
                },
                snippets:{}
            }
        },
        methods: {
            close() {
                this.$emit('close');
                this.script = '';
            },
            copy() {

            },
            setSnip(key,snip,prev){
                if(prev){
                    this.prev.key = '';
                    this.filteredSnippets = this.prev.snip;
                }else{
                    if (snip['script'] === undefined){
                        this.prev.key = key;
                        this.prev.snip = this.filteredSnippets;
                        this.filteredSnippets = this.filteredSnippets[key];
                    }else{
                        this.script = snip.script;
                    }
                }
            },
            saveSnip(){
            let key = this.prev.key;
            let name = this.saveName;
            if (key){
                if(name && this.script){
                    Object.defineProperty(this.snippets[key], name, {
                        value: {script: this.script},
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                    this.writeScripts();
                }
            }else{
                if(name){
                    Object.defineProperty(this.snippets, name, {
                        value: {},
                        enumerable: true,
                        configurable: true,
                        writable: true
                    });
                    this.writeScripts();
                }
            }
            },
            writeScripts(){
                if (fs.existsSync('./scripts.json')) {
                    fs.readFile('scripts.json', 'utf8', (err, data) => {
                        if (err) throw err;
                        else {
                        fs.writeFile('scripts.json', JSON.stringify(this.snippets), 'utf8', err => {
                            if (err) throw err;
                            this.prev.key = '';
                            this.saveName = '';
                            this.script = '';
                            this.filteredSnippets = this.snippets;
                        });
                        }
                    });
                    }else {
                        fs.writeFile('scripts.json', JSON.stringify(this.snippets), 'utf8', err => {
                            if (err) throw err;
                            this.prev.key = '';
                            this.saveName = '';
                            this.script = '';
                            this.filteredSnippets = this.snippets;
                        });
                    }
            },
            readScripts(){
                if (fs.existsSync('./scripts.json')) {
                    fs.readFile('scripts.json', 'utf8', (err, data) => {
                        this.snippets = JSON.parse(data);
                        this.filteredSnippets = this.snippets;
                        this.prev.snip = this.filteredSnippets;
                    });
                }
            },
            insert(method){
                if (this.script.length > 0 && this.prev.key){
                    let eachLine = this.script.split('\n');
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
                                eachLine.splice(eachLine.length, 0, `SET DELETED ON \nUSE IN ${this.prev.key}`);
                            }
                            break;
                        }
                        this.script = eachLine.join('\n');
                    }
                }
        },
        beforeMount(){
            this.readScripts();
        }
    }
</script>

<style>
</style>