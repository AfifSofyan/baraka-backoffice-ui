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
                :label="label ? label : 'Waktu'"
                variant="outlined"
                v-model="timeString"
                append-inner-icon="mdi-clock-outline"
                :rules="rules"
            />
        </template>
        <v-card max-width="300" class="ma-0 px-2 pt-2" style="top:-20px">
            <div class="d-flex">
                <div style="width:120px">
                    <v-autocomplete
                        v-model="hour"
                        :items="hourList"
                        placeholder="Jam"
                        variant="outlined"
                        class="mx-2"
                    />
                </div>
                <div>
                    <p class="pt-3">:</p>
                </div>
                <div style="width:120px">
                    <v-autocomplete
                        v-model="min"
                        :items="minList"
                        placeholder="Menit"
                        variant="outlined"
                        class="mx-2"
                    />
                </div>
            </div>

            <v-card-actions class="d-flex justify-end">
                <v-btn class="pa-0 ma-0 color-secondary" @click="menu = false">CANCEL</v-btn>
                <v-btn class="pa-0 ma-0 color-secondary" @click="handleTimeChange">OK</v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
import moment from 'moment'

export default{
    props: {
        defaultTime:{
            type:String
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
            hour: null,
            min: null,
            time: null,
            timeString: null,
            hourList:[
                "00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23",
            ],
            minList:[
                "00","30"
            ]
        }
    },
    created(){
        if(this.defaultTime){
            this.presetDefaultTime(this.defaultTime)
        }
    },
    watch:{
        defaultTime(newVal, oldVal){
            this.presetDefaultTime(newVal)
        }
    },
    methods:{
        handleTimeChange(){
            this.timeString=`${this.hour}:${this.min}`
            this.time=`${this.hour}:${this.min}:00`

            this.menu = false

            this.$emit('handleTimeChange', this.time)
        },
        presetDefaultTime(val){
            const momentTime = moment(val, 'HH:mm')
            if(momentTime.isValid()){
                this.timeString = momentTime.format('HH:mm');
                this.time = `${val}:00`
                this.hour = moment(momentTime).format('HH')
                this.min = moment(momentTime).format('mm')
            }
        },
        resetTime(){
            this.timeString = null
        }
    }
}
</script>