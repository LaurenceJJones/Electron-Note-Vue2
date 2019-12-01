<template>
    <div class="is-inline-flex">
        <div class="box master">
            <div class="is-inline-flex">
                <p v-if="!edit">{{collection.key}}</p>
                <input type="text" v-else v-model="currentKey">
                <span class="icon has-text-white" @click="complete" v-if="!edit">
                    <i class="far fa-check-square"></i>
                </span>
                <span class="icon has-text-white" @click="editMode" v-if="!edit">
                    <i class="fas fa-pencil-alt"></i>
                </span>
                <span class="icon has-text-white" @click="editMode" v-else>
                    <i class="fas fa-save"></i>
                </span>
            </div>
            <div class="box is-clipped">
            <article class="media">
                <div class="media-content">
                <div class="content">
                    <ul>
                        <li v-for="(item , index) in collection.names" :key="index">{{item}}</li>
                        <li v-if="edit"><input type="text" v-model="currentAdd" @keyup.enter="add"></li>
                    </ul>
                </div>
                </div>
            </article>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props : ['collection' , 'index'],
    data(){
        return {
            edit: false,
            currentKey: '',
            currentAdd: ''
        }
    },
    methods:{
        editMode(){
            if (!this.edit){
                this.edit = !this.edit;
            }else{
                this.edit = !this.edit;
                this.$store.dispatch('modify',{
                    loc : 'collection',
                    orgIndex : this.index,
                    key : 'key',
                    val : this.currentKey,
                    type : 'put'
                });
            }
        },
        add(){
            this.$store.dispatch('modify',{
                loc : 'collection',
                orgIndex : this.index,
                key : 'names',
                val : this.currentAdd,
                type : 'push'
            });
        },
        complete(){
            this.$store.dispatch('delete', {
                loc : 'collection',
                orgIndex : this.index
            });
        }
    },
    beforeMount(){
        this.currentKey = this.collection.key;
    }
}
</script>
<style>
    .box.master span {
        display: none;
        cursor: pointer;
    }
    .box.master:hover span{
        display: inline-flex;
    }
</style>