<template>
    <div 
        class="d-flex align-center"
        :class="textColor, fontSize"        
    >
        <v-btn icon 
            v-if="useBackButton" 
            @click="back"
            variant="plain"
            color="primary"
            :class="buttonSize"
        >
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <p class="ml-n2">{{ title }}</p>
    </div>
</template>

<script>
    export default {
        props: {
            title: String,
            useBackButton: Boolean,
            size: String,
            color: String
        },
        data(){
            return{
                textColor: null,
                fontSize: null,
                buttonSize: null,
            }
        },
        created(){
            this.textColor = this.color ? `color-${this.color}` : 'color-slate'
            this.fontSize = this.size ? `font-${this.size}` : 'font-24'
            this.buttonSize = this.size? `font-${this.size - 2}` : 'font-22'
        },
        methods:{
            back(){
                this.$emit('back')
            }
        }
    }
</script>