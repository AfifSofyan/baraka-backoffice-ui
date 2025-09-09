<template>
    <div v-if="!initialLoading && isAuthorized">
        <BrkTitle 
            title="Jadwal Les"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4 ml-n2"
        />
        <v-container class="pa-0">
            <v-row class="mx-1 my-1">
                <BrkButton
                    v-if="$root.hasAccess('Tambah Jadwal')"
                    buttonText="Tambah Jadwal"
                    icon="mdi-plus"
                    color="primary"
                    @click="() => $router.push('/backoffice/jadwal/create')"
                />
            </v-row>
            <v-row>
                <v-col cols="12" sm="6" md="5" class="py-0">
                    <BrkSearch
                        v-if="isNotTutorOrStudent"
                        :placeholder="`Cari ${scheduleMode == 'tutor' ? 'Tutor' : 'Siswa'} ...`"
                        :initialSearchText="searchText"
                        @isLoading="() => $emit('isLoading', true)"
                        @handleSearchChange="handleSearchChange"
                    />
                </v-col>
            </v-row>
        </v-container>

        <v-switch
            v-if="isNotTutorOrStudent"
            v-model="scheduleMode"
            hide-details
            true-value="student"
            false-value="tutor"
            class="mb-2 ml-4"
            density="compact"
            @update:model-value="handleModeChange"
            :label="`Mode Jadwal: ${scheduleMode == 'tutor' ? 'Tutor' : 'Siswa'}`"
        />

        <v-container id="target-scroll" style="overflow: auto; max-height:70vh" class="pa-0">
            <v-table v-scroll:#target-scroll="handleScroll" class="overwrite__v-table">
                <thead style="position:sticky; top:0; z-index:999" height="50">
                    <th style="position:sticky; top:0; left:0; z-index:999" class="bg-secondary" v-if="isNotTutorOrStudent">
                        <div style="width:150px">
                            Nama
                        </div>
                    </th>
                    <th 
                        v-for="(day, dayIndex) in days_list"
                        :key="dayIndex"
                    >
                        <div style="width:150px;">
                            <p>{{ day.Name }}</p>
                        </div>
                    </th>
                </thead>
                <tbody>
                    <tr v-for="(schedule, scheduleIndex) in scheduleList" :key="scheduleIndex" style="border:1px solid gray">
                        <td v-if="isNotTutorOrStudent" style="position:sticky; left:0; z-index:99; vertical-align: top;" class="pt-2 bg-white">{{ scheduleMode == 'tutor' ? schedule.detail.TutorName : schedule.detail.StudentName }}</td>
                        <td v-for="(data, dataIndex) in schedule.dailyData" :key="dataIndex" class="align-top">
                            <v-row v-if="data.schedules.length > 0">
                                <v-col>
                                    <v-card 
                                        v-for="(singleSchedule, singleIndex) in data.schedules" 
                                        :key="singleIndex"
                                        variant="tonal"
                                        class="my-2 bg-primary color-white"
                                        width="120"
                                        @click="() => $router.push(`/backoffice/jadwal/${singleSchedule.ID}`)"
                                    >
                                        <v-card-item class="px-2 py-0">
                                            <v-card-title class="font-14">{{ scheduleMode == 'tutor' ? singleSchedule.StudentName : singleSchedule.TutorName}}</v-card-title>

                                            <v-card-subtitle>
                                                {{ $root.formatTime(singleSchedule.Time) }}
                                            </v-card-subtitle>
                                        </v-card-item>

                                        <v-card-text class="px-2 py-0" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            {{ singleSchedule.SubjectName }}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-container>

    </div>
</template>

<script>
    import BrkTitle from '@/components/pages/BrkTitle.vue';
    import BrkDatePicker from '@/components/pages/BrkDatePicker.vue';
    import BrkSearch from '@/components/pages/BrkSearch.vue';
    import BrkNoData from '@/components/pages/BrkNoData.vue';
    import BrkButton from '@/components/pages/BrkButton.vue';
    import { days_list } from '@/utils/database-static-records/days.js';
    import scheduleService from '@/services/schedule/scheduleService.js';

    export default {
        components:{
            BrkTitle,
            BrkDatePicker,
            BrkSearch,
            BrkNoData,
            BrkButton,
        },
        data(){
            return {
                isAuthorized: false,
                scheduleMode: JSON.parse(localStorage.getItem('roleName')) == 'student' ? 'student' : 'tutor',
                isNotTutorOrStudent: !['tutor', 'student'].includes(JSON.parse(localStorage.getItem('roleName'))),
                searchText: '',
                page: 1,
                perPage: 15,
                scheduleList: [],
                dateList: [],
                allDataRetrieved: false,
                loadNewSchedule: false,
                initialLoading: true,
                cardDetail: null,

                days_list: days_list,
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Jadwal")
            this.loadData()
        },
        methods:{
            async loadData(){
                console.log(this.scheduleMode)
                await this.fetchScheduleData()
            },
            convertWeekDay(date){
                const dayObj = days_list.find(day => day.DayOfTheWeek === this.$root.formatDate(date, 'weekday'))
                return dayObj.Name
            },
            async handleModeChange(){
                // this.initialLoading = true
                this.allDataRetrieved = false
                this.searchText = ''
                this.page = 1
                this.scheduleList = []
                await this.fetchScheduleData()
                // this.initialLoading = false
            },
            handleSearchChange(searchText){
                this.allDataRetrieved = false
                this.searchText = searchText
                this.page = 1
                this.scheduleList = []
                this.fetchScheduleData()    
            },
            async fetchScheduleData(){
                if(this.page == 1){
                    this.$emit('isLoading', true);
                }
                this.loadNewSchedule = true;
                try {
                    const response = await scheduleService.getScheduleList({
                        scheduleMode: this.scheduleMode,
                        searchText: this.searchText,
                        page: this.page,
                        perPage: this.perPage
                    });

                    const _currentScheduleList = response.data.data.schedules;
                    if(_currentScheduleList.length > 0){
                        this.scheduleList = [
                            ...this.scheduleList,
                            ..._currentScheduleList
                        ];
                    }else{
                        this.allDataRetrieved = true;
                        console.log('All data have been retrieved');
                    }

                    if(this.page == 1){
                        this.initialLoading = false;
                    }

                    console.log(this.scheduleList)
                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false);
                    this.loadNewSchedule = false;
                    console.log('finished retrieveing new set of presence')
                }
            },
            async handleScroll(e){
                const scrollHeight = e.target.scrollHeight;
                const scrollTop = e.target.scrollTop;
                const heightLeft = scrollHeight - scrollTop;

                if(heightLeft < 2000 && !this.loadNewSchedule && !this.allDataRetrieved){
                    this.page ++
                    console.log('retrieveing new set of schedule')
                    await this.fetchScheduleData()
                }
            },
            back(){
                this.$router.push("/backoffice/dashboard")
            },
        }
    }
</script>

<style scoped>
    td{
        border:0.1em solid rgb(180, 180, 180);
    }
</style>