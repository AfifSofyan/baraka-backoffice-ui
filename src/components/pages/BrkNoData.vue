<template>
    <h4 class="text-center my-10"><v-icon>mdi-database-search</v-icon> {{ customMessage ? customMessage : 'Data Tidak Ditemukan' }}</h4>
</template>

<script>
    export default{
        props:{
            customMessage:{
                type:String,
                required:false
            }
        }
    }
</script>