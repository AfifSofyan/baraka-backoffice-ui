<template>
    <v-text-field 
        :placeholder="placeholder ? placeholder : 'Cari ...'"
        append-inner-icon="mdi-magnify"
        variant="outlined"
        v-model="searchText"
        @update:model-value="() => $emit('isLoading')"
        @input="handleSearchChange"
    />
</template>

<script>
export default {
    name: 'BrkSearch',
    props: {
        placeholder: {
            type: String,
        },
        initialSearchText:{
            type: String
        }
    },
    data() {
        return {
            searchText: '',
            debouncedSearch: null
        }
    },
    watch:{
        initialSearchText(newText, oldText){
            this.searchText = newText
        }
    },
    methods: {
        handleSearchChange() {
            if (this.debouncedSearch) {
                clearTimeout(this.debouncedSearch)
            }

            this.debouncedSearch = setTimeout(() => {
                this.$emit('handleSearchChange', this.searchText)
            }, 1000)
        }
    },
    destroyed() {
        if (this.debouncedSearch) {
            clearTimeout(this.debouncedSearch)
        }
    }
}
</script>
