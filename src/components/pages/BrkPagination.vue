<template>
    <div class="mt-10 mx-4" v-if="paginationInfo.totalData > 0">
        <v-container class="py-4">
            <v-row justify="start" class="px-0" align-content="start">
                <v-col cols="4" sm="2" lg="1" class="pa-0">
                    <v-autocomplete
                        style="width:100px"
                        :items="[10, 15, 20, 50, 100, 500]"
                        variant="outlined"
                        label="show"
                        v-model="perPage"
                        @update:model-value="handlePerPageChange"
                    />
                </v-col>
                <v-col cols="8" sm="6" lg="4" class="pa-0">
                    <v-container class="max-width pa-0">
                        <v-pagination
                            v-model="page"
                            class="my-0 pa-0"
                            :length="paginationInfo.totalPage"
                            density="compact"
                            @update:model-value="handlePageChange"
                            color="secondary"
                        ></v-pagination>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default{
    props:{
        paginationInfo: {
            type: Object,
            required: true
        },
        initialPage: {
            type: Number,
            required: true
        },
        initialPerPage: {
            type: Number,
            required: true
        },
    },
    created(){
        this.page = this.initialPage
        this.perPage = this.initialPerPage
    },
    data(){
        return {
            page: null,
            perPage: null
        }
    },
    methods: {
        handlePageChange(){
            this.$emit('handlePageChange', this.page)
        },
        handlePerPageChange(){
            this.$emit('handlePerPageChange', this.perPage)
        },
    }
}
</script>