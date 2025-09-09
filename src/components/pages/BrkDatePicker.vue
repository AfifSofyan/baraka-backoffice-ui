<template>
    <v-menu 
        :close-on-content-click="false"
        v-model="menu"
        :disabled="readonly"
    >
        <template v-slot:activator="{props: activatorProp}">
            <v-text-field
                v-bind="activatorProp"
                readonly
                :label="label ? label : (mode == 'range' ? 'Rentang Tanggal' : 'Tanggal')"
                variant="outlined"
                v-model="dateString"
                append-inner-icon="mdi-calendar"
                :rules="rules"
            >
                <template v-slot:prepend-inner>
                    <v-tooltip location="bottom" content-class="bg-white opacity-0">
                        <template v-slot:activator="{ props }">
                            <v-icon 
                                v-if="hasOneMonthBack" 
                                @click.stop="$emit('backOneMonth')" 
                                v-bind="props" 
                            >
                                mdi-chevron-left
                            </v-icon>
                        </template>
                        <span class="font-12 text-gray">Mundur 1 Bulan</span>
                    </v-tooltip>
                    <v-tooltip location="bottom" content-class="bg-white opacity-0">
                        <template v-slot:activator="{ props }">
                            <v-icon 
                                v-if="hasOneMonthForward" 
                                @click.stop="$emit('forwardOneMonth')" 
                                v-bind="props" 
                            >
                                mdi-chevron-right
                            </v-icon>
                        </template>
                        <span class="font-12 text-gray">Maju 1 Bulan</span>
                    </v-tooltip>
                </template>
            </v-text-field>
        </template>
        <v-date-picker
            v-model="date"
            @update:model-value="handleDateChange"
            color="secondary"
            rounded
            show-adjacent-months
            :min="min ? min : undefined"
            :max="max ? max : undefined"
            :multiple="mode == 'range'"
        ></v-date-picker>
    </v-menu>
</template>

<script>
import moment from 'moment'

export default{
    emits:['handleDateChange', 'backOneMonth', 'forwardOneMonth'],
    props: {
        mode:{
            type:String,
        },
        defaultDateRange:{
            type:Object
        },
        defaultDate:{
            type:String
        },
        max:{
            type:String
        },
        min:{
            type:String
        },
        hasOneMonthBack: {
            type:Boolean
        },
        hasOneMonthForward: {
            type:Boolean
        },
        label:{
            type:String
        },
        readonly:{
            type:Boolean
        },
        rules:{
            type:Array
        }
    },
    data(){
        return {
            menu: false,
            date: null,
            dateString: null,
        }
    },
    created(){
        if(this.defaultDateRange){
            const startDateString = this.$root.formatDate(this.defaultDateRange.startDate)
            const endDateString = this.$root.formatDate(this.defaultDateRange.endDate)

            this.dateString = `${startDateString} — ${endDateString}`
            this.date = [new Date(this.defaultDateRange.startDate), new Date(this.defaultDateRange.endDate)]
        }

        if(this.defaultDate){
            this.presetDefaultDate(this.defaultDate)
        }
    },
    watch:{
        defaultDateRange(newVal, oldVal){
            this.presetDefaultDateRange(newVal)
        },

        defaultDate(newVal, oldVal){
            this.presetDefaultDate(newVal)
        }
    },
    methods:{
        handleDateChange(){
            if(this.mode == 'range'){
                console.log(this.date)
                const [startDate, endDate] = this.date
                const startDateString = this.$root.formatDate(startDate)
                const endDateString = this.$root.formatDate(endDate)

                this.dateString = `${startDateString} — ${endDateString}`
            }
            else{
                this.dateString = moment(this.date).format('DD MMM YYYY')
            }


            this.menu = false

            this.$emit('handleDateChange', this.date)
        },
        presetDefaultDate(val){
            this.dateString = this.$root.formatDate(val)
            this.date = new Date(val)
        },
        presetDefaultDateRange(val){
            const startDateString = this.$root.formatDate(val.startDate)
            const endDateString = this.$root.formatDate(val.endDate)

            this.dateString = `${startDateString} — ${endDateString}`
            this.date = [new Date(val.startDate), new Date(val.endDate)]
        }
    }
}
</script>