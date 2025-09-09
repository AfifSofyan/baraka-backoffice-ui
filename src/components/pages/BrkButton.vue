<template>
    <v-btn
        variant="tonal"
        :color="color ? color : 'primary'"
        :prepend-icon="icon ? icon : null"
        :disabled="disabled"
        elevation="2"
        rounded="lg"
        @click="() => $emit('click')"
    >
        {{ buttonText }}
    </v-btn>
</template>
<script>
export default{
    props:{
        buttonText:{
            type:String,
            required:true
        },
        color:{
            type:String
        },
        icon:{
            type:String
        },
        disabled:{
            type:Boolean,
            default:false
        }
    }
}

</script>