<template>
    <div v-if="!initialLoading && isAuthorized">
        <BrkTitle 
            title="Presensi"
            :useBackButton="true"
            @back="back"
            color="primary"
            class="mb-4"
        />
        <v-container>
            <v-row>
                <v-col cols="12" sm="6" md="5" class="py-0">
                    <BrkDatePicker
                        mode="range"
                        :defaultDateRange="dateRange"
                        hasOneMonthBack
                        hasOneMonthForward
                        @handleDateChange="handleDateChange"
                        @backOneMonth="backOneMonth"
                        @forwardOneMonth="forwardOneMonth"
                    />
                </v-col>
                <v-col cols="12" sm="6" md="5" class="py-0">
                    <BrkSearch
                        v-if="isNotTutorOrStudent"
                        :placeholder="`Cari ${presenceMode == 'tutor' ? 'Tutor' : 'Siswa'} ...`"
                        :initialSearchText="searchText"
                        @isLoading="() => $emit('isLoading', true)"
                        @handleSearchChange="handleSearchChange"
                    />
                </v-col>
            </v-row>
        </v-container>

        <v-switch
            v-if="isNotTutorOrStudent"
            v-model="presenceMode"
            hide-details
            true-value="student"
            false-value="tutor"
            class="mb-2 ml-4"
            density="compact"
            @update:model-value="handleModeChange"
            :label="`Mode Presensi: ${presenceMode == 'tutor' ? 'Tutor' : 'Siswa'}`"
        />

        <v-sheet>
            <v-btn
                icon
                size="small"
                variant="plain"
                class="float-right"
                @click="openPresenceInFullscreen = true"
            >
                <v-icon>mdi-arrow-expand</v-icon>
            </v-btn>        
        </v-sheet>

        <v-container id="target-scroll" style="overflow: auto; max-height:70vh" class="pa-0" v-if="!initialLoading && !openPresenceInFullscreen">
            <v-table v-scroll:#target-scroll="handleScroll" class="overwrite__v-table">
                <thead style="position:sticky; top:0; z-index:999" height="50">
                    <th v-if="isNotTutorOrStudent" style="position:sticky; top:0; left:0; z-index:999" class="bg-secondary">
                        <div style="width:150px">
                            Nama
                        </div>
                    </th>
                    <th 
                        v-for="(date, dateIndex) in dateList"
                        :key="dateIndex"
                    >
                        <div style="width:150px;">
                            <p>{{ convertWeekDay(date) }}</p>
                            <p>{{$root.formatDate(date) }}</p>
                        </div>
                    </th>
                </thead>
                <tbody>
                    <tr v-for="(presence, presenceIndex) in presenceList" :key="presenceIndex" style="border:1px solid gray">
                        <td v-if="isNotTutorOrStudent" style="position:sticky; left:0; z-index:99; vertical-align: top;" class="pt-2 bg-white">{{ presenceMode == 'tutor' ? presence.detail.TutorName : presence.detail.StudentName }}</td>
                        <td v-for="(presence, dataIndex) in presence.dailyData" :key="dataIndex" class="align-top">
                            <v-row v-if="presence.reports.length > 0">
                                <v-col class="pb-0">
                                    <v-card 
                                        v-for="(report, reportIndex) in presence.reports" 
                                        :key="reportIndex"
                                        variant="tonal"
                                        class="my-2 bg-primary color-white"
                                        width="120"
                                        @click="handleNoteModalOpen(
                                            report.PresenceNote, 
                                            {
                                                Type: 'report',
                                                TutorName: report.TutorName,
                                                StudentName: report.StudentName,
                                                Date: report.Date,
                                                ReportID: report.ID,
                                            }
                                        )"
                                    >
                                        <v-card-item class="px-2 py-0">
                                            <v-card-title class="font-14">{{ presenceMode == 'tutor' ? report.StudentName : report.TutorName}}</v-card-title>

                                            <v-card-subtitle>
                                                {{ $root.formatTime(report.TimeStart) }}
                                                <v-icon
                                                    v-if="report.PresenceNote"
                                                    size="x-small" 
                                                    class="ml-2"
                                                    :class="`presence-note-type-${report.PresenceNote.TypeID}`"
                                                >mdi-note-text</v-icon>
                                            </v-card-subtitle>
                                        </v-card-item>

                                        <v-card-text class="px-2 py-0" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            {{ report.SubjectName }}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-row v-if="presence.schedules.length > 0">
                                <v-col >
                                    <v-card 
                                        v-for="(schedule, scheduleIndex) in presence.schedules" 
                                        :key="scheduleIndex"
                                        variant="tonal"
                                        class="my-2 bg-gray color-white"
                                        style="position:relative !important"
                                        width="120"
                                        @click="handleNoteModalOpen(
                                            schedule.PresenceNote, 
                                            {
                                                Type: 'schedule',
                                                TutorName: schedule.TutorName,
                                                StudentName: schedule.StudentName,
                                                ScheduleID: schedule.ID,
                                                Date: presence.date
                                            }
                                        )"
                                    >
                                        <v-card-item class="px-2 py-0">
                                            <v-card-title class="font-14">{{ presenceMode == 'tutor' ? schedule.StudentName : schedule.TutorName}}</v-card-title>

                                            <v-card-subtitle>
                                                {{ $root.formatTime(schedule.Time) }}
                                                <v-icon
                                                    v-if="schedule.PresenceNote"
                                                    size="x-small" 
                                                    class="ml-2"
                                                    :class="`presence-note-type-${schedule.PresenceNote.TypeID}`"
                                                >mdi-note-text</v-icon>
                                            </v-card-subtitle>
                                        </v-card-item>

                                        <v-card-text class="px-2 py-0" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            {{ schedule.SubjectName }}
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                            
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </v-container>

        <v-dialog 
            fullscreen
            v-if="openPresenceInFullscreen" 
            v-model="openPresenceInFullscreen" 
            :scrim="false"
            transition="dialog-bottom-transition"
        >
            <v-card>
            <v-toolbar
            density="compact"
            >
                <v-spacer />
                <v-btn
                    icon
                    @click="openPresenceInFullscreen = false"
                    class="mr-4"
                    type="plain"
                    color="gray"
                >
                    <v-icon color="gray">mdi-arrow-collapse</v-icon>
                </v-btn>
            </v-toolbar>
            <v-container id="target-scroll" style="overflow: auto; max-width:100%; width:100%" class="pa-0" v-if="!initialLoading">
                <v-table v-scroll:#target-scroll="handleScroll" class="overwrite__v-table">
                    <thead style="position:sticky; top:0; z-index:999" height="50">
                        <th v-if="isNotTutorOrStudent" style="position:sticky; top:0; left:0; z-index:999" class="bg-secondary">
                            <div style="width:150px">
                                Nama
                            </div>
                        </th>
                        <th 
                            v-for="(date, dateIndex) in dateList"
                            :key="dateIndex"
                        >
                            <div style="width:150px;">
                                <p>{{ convertWeekDay(date) }}</p>
                                <p>{{$root.formatDate(date) }}</p>
                            </div>
                        </th>
                    </thead>
                    <tbody>
                        <tr v-for="(presence, presenceIndex) in presenceList" :key="presenceIndex" style="border:1px solid gray">
                            <td v-if="isNotTutorOrStudent" style="position:sticky; left:0; z-index:99; vertical-align: top;" class="pt-2 bg-white">{{ presenceMode == 'tutor' ? presence.detail.TutorName : presence.detail.StudentName }}</td>
                            <td v-for="(presence, dataIndex) in presence.dailyData" :key="dataIndex" class="align-top">
                                <v-row v-if="presence.reports.length > 0">
                                    <v-col class="pb-0">
                                        <v-card 
                                            v-for="(report, reportIndex) in presence.reports" 
                                            :key="reportIndex"
                                            variant="tonal"
                                            class="my-2 bg-primary color-white"
                                            width="120"
                                            @click="handleNoteModalOpen(
                                                report.PresenceNote, 
                                                {
                                                    Type: 'report',
                                                    TutorName: report.TutorName,
                                                    StudentName: report.StudentName,
                                                    ReportID: report.ID,
                                                    Date: report.Date
                                                }
                                            )"
                                        >
                                            <v-card-item class="px-2 py-0">
                                                <v-card-title class="font-14">{{ presenceMode == 'tutor' ? report.StudentName : report.TutorName }}</v-card-title>

                                                <v-card-subtitle>
                                                    {{ $root.formatTime(report.TimeStart) }}
                                                    <v-icon
                                                        v-if="report.PresenceNote"
                                                        size="x-small" 
                                                        class="ml-2"
                                                        :class="`presence-note-type-${report.PresenceNote.TypeID}`"
                                                    >mdi-note-text</v-icon>
                                                </v-card-subtitle>
                                            </v-card-item>

                                            <v-card-text class="px-2 py-0" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                {{ report.SubjectName }}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row v-if="presence.schedules.length > 0">
                                    <v-col >
                                        <v-card 
                                            v-for="(schedule, scheduleIndex) in presence.schedules" 
                                            :key="scheduleIndex"
                                            variant="tonal"
                                            class="my-2 bg-gray color-white"
                                            style="position:relative !important"
                                            width="120"
                                            @click="handleNoteModalOpen(
                                                schedule.PresenceNote, 
                                                {
                                                    Type: 'schedule',
                                                    TutorName: schedule.TutorName,
                                                    StudentName: schedule.StudentName,
                                                    ScheduleID: schedule.ID,
                                                    Date: presence.date
                                                }
                                            )"
                                        >
                                            <v-card-item class="px-2 py-0">
                                                <v-card-title class="font-14">{{ presenceMode == 'tutor' ? schedule.StudentName : schedule.TutorName}}</v-card-title>

                                                <v-card-subtitle>
                                                    {{ $root.formatTime(schedule.Time) }}
                                                    <v-icon
                                                        v-if="schedule.PresenceNote"
                                                        size="x-small" 
                                                        class="ml-2"
                                                        :class="`presence-note-type-${schedule.PresenceNote.TypeID}`"
                                                    >mdi-note-text</v-icon>
                                                </v-card-subtitle>
                                            </v-card-item>

                                            <v-card-text class="px-2 py-0" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                                {{ schedule.SubjectName }}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-container>
            </v-card>
        </v-dialog>

        <NoteModal 
            :isOpen="openNoteModal"
            @handleModalClose="handleModalClose"
            :selectedNote="selectedNote"
            :cardDetail="cardDetail"
            @isLoading="(state) => $emit('isLoading', state)"
            @handleCreateScheduleNote="handleCreateScheduleNote"
            @handleDeleteScheduleNote="handleDeleteScheduleNote"
            @handleUpdateScheduleNote="handleUpdateScheduleNote"
            @handleCreateReportNote="handleCreateReportNote"
            @handleDeleteReportNote="handleDeleteReportNote"
            @handleUpdateReportNote="handleUpdateReportNote"
        />
    </div>
</template>

<script>
    import BrkTitle from '@/components/pages/BrkTitle.vue';
    import BrkDatePicker from '@/components/pages/BrkDatePicker.vue';
    import BrkSearch from '@/components/pages/BrkSearch.vue';
    import BrkNoData from '@/components/pages/BrkNoData.vue';
    import NoteModal from '@/views/presence/components/NoteModal.vue';
    import { days_list } from '@/utils/database-static-records/days.js';
    import setter from '@/utils/app/data-setter.js';
    import presenceService from '@/services/presence/presenceService.js';

    export default {
        components:{
            BrkTitle,
            BrkDatePicker,
            BrkSearch,
            BrkNoData,
            NoteModal
        },
        data(){
            return {
                isAuthorized: false,
                
                presenceMode: JSON.parse(localStorage.getItem('roleName')) == 'student' ? 'student' : 'tutor',
                isNotTutorOrStudent: !['tutor', 'student'].includes(JSON.parse(localStorage.getItem('roleName'))),
                searchText: '',
                page: 1,
                perPage: 15,
                dateRange: setter.setDateRange({
                    mode: setter.constants.DATERANGE_MODE_MONTHLY,
                    duration: 1,
                    direction: setter.constants.DATERANGE_DIRECTION_THIS_POINT_FORWARD
                }),
                presenceList: [],
                dateList: [],
                allDataRetrieved: false,
                loadNewPresence: false,
                initialLoading: true,
                openPresenceInFullscreen: false,
                openNoteModal: false,
                selectedNote: null,
                cardDetail: null
            }
        },
        async created(){
            this.isAuthorized = await this.$root.isAuthorizedToAccess("Presensi")
            this.loadData()
        },
        methods:{
            async loadData(){
                await this.fetchPresenceData()
            },
            convertWeekDay(date){
                const dayObj = days_list.find(day => day.DayOfTheWeek === this.$root.formatDate(date, 'weekday'))
                return dayObj.Name
            },
            async handleDateChange(value){
                this.allDataRetrieved = false
                this.dateRange.startDate = this.$root.formatDate(value[0], 'inputDate')
                this.dateRange.endDate = this.$root.formatDate(value[1], 'inputDate')
                this.page = 1
                this.presenceList = []
                await this.fetchPresenceData()
            },
            async backOneMonth(){
                this.dateRange = setter.backOneMonth(this.dateRange)
                this.allDataRetrieved = false
                this.page = 1
                this.presenceList = []
                await this.fetchPresenceData()
            },
            async forwardOneMonth(){
                this.dateRange = setter.forwardOneMonth(this.dateRange)
                this.allDataRetrieved = false
                this.page = 1
                this.presenceList = []
                await this.fetchPresenceData()
            },
            async handleModeChange(){
                // this.initialLoading = true
                this.allDataRetrieved = false
                this.searchText = ''
                this.page = 1
                this.presenceList = []
                await this.fetchPresenceData()
                // this.initialLoading = false
            },
            handleSearchChange(searchText){
                this.allDataRetrieved = false
                this.searchText = searchText
                this.page = 1
                this.presenceList = []
                this.fetchPresenceData()    
            },
            handleNoteModalOpen(selectedNote, cardDetail){
                this.selectedNote = selectedNote
                this.cardDetail = cardDetail
                if(this.$root.hasAccess("Tambah Catatan Presensi") || selectedNote){
                    this.openNoteModal = true
                }
            },
            handleModalClose(){
                this.selectedNote = null
                this.openNoteModal = false
            },
            handleCreateScheduleNote(createdNote){
                this.$emit('isLoading', true)
                this.presenceList.forEach(presence => {
                    if(presence.detail.ID == (this.presenceMode == 'tutor' ? createdNote.TutorID : createdNote.StudentID)){
                        presence.dailyData.forEach(data => {
                            if(data.date == this.$root.formatDate(createdNote.Date, 'inputDate' )){
                                data.schedules.forEach(schedule => {
                                    if(schedule.ID == createdNote.ScheduleID){
                                        schedule.PresenceNote = {
                                            ...createdNote
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
                this.$emit('isLoading', false)
            },
            handleUpdateScheduleNote(updatedNote){
                this.$emit('isLoading', true)
                this.presenceList.forEach(presence => {
                    if(presence.detail.ID == (this.presenceMode == 'tutor' ? updatedNote.TutorID : updatedNote.StudentID)){
                        presence.dailyData.forEach(data => {
                            if(data.date == this.$root.formatDate(updatedNote.Date, 'inputDate' )){
                                data.schedules.forEach(schedule => {
                                    if(schedule.ID == updatedNote.ScheduleID){
                                        schedule.PresenceNote = {
                                            ...updatedNote
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
                this.$emit('isLoading', false)
            },
            handleDeleteScheduleNote(deletedNote){
                this.$emit('isLoading', true)
                this.presenceList.forEach(presence => {
                    if(presence.detail.ID == (this.presenceMode == 'tutor' ? deletedNote.TutorID : deletedNote.StudentID)){
                        presence.dailyData.forEach(data => {
                            if(data.date == this.$root.formatDate(deletedNote.Date, 'inputDate' )){
                                data.schedules.forEach(schedule => {
                                    if(schedule.ID == deletedNote.ScheduleID){
                                        schedule.PresenceNote = null
                                    }
                                })
                            }
                        })
                    }
                })
                this.$emit('isLoading', false)
            },
            handleCreateReportNote(createdNote){
                this.$emit('isLoading', true)
                this.presenceList.forEach(presence => {
                    if(presence.detail.ID == (this.presenceMode == 'tutor' ? createdNote.TutorID : createdNote.StudentID)){
                        presence.dailyData.forEach(data => {
                            if(data.date == this.$root.formatDate(createdNote.Date, 'inputDate' )){
                                data.reports.forEach(report => {
                                    if(report.ID == createdNote.ReportID){
                                        report.PresenceNote = {
                                            ...createdNote
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
                this.$emit('isLoading', false)
            },
            handleUpdateReportNote(updatedNote){
                this.$emit('isLoading', true)
                this.presenceList.forEach(presence => {
                    if(presence.detail.ID == (this.presenceMode == 'tutor' ? updatedNote.TutorID : updatedNote.StudentID)){
                        presence.dailyData.forEach(data => {
                            if(data.date == this.$root.formatDate(updatedNote.Date, 'inputDate' )){
                                data.reports.forEach(report => {
                                    if(report.ID == updatedNote.ReportID){
                                        report.PresenceNote = {
                                            ...updatedNote
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
                this.$emit('isLoading', false)
            },
            handleDeleteReportNote(deletedNote){
                this.$emit('isLoading', true)
                this.presenceList.forEach(presence => {
                    if(presence.detail.ID == (this.presenceMode == 'tutor' ? deletedNote.TutorID : deletedNote.StudentID)){
                        presence.dailyData.forEach(data => {
                            if(data.date == this.$root.formatDate(deletedNote.Date, 'inputDate' )){
                                data.reports.forEach(report => {
                                    if(report.ID == deletedNote.ReportID){
                                        report.PresenceNote = null
                                    }
                                })
                            }
                        })
                    }
                })
                this.$emit('isLoading', false)
            },
            async fetchPresenceData(){
                if(this.page == 1){
                    this.$emit('isLoading', true);
                }
                this.loadNewPresence = true;
                try {
                    const response = await presenceService.getPresenceList({
                        presenceMode: this.presenceMode,
                        searchText: this.searchText,
                        startDate: this.dateRange.startDate,
                        endDate: this.dateRange.endDate,
                        page: this.page,
                        perPage: this.perPage
                    });

                    const _currentPresenceList = response.data.data.presence;
                    if(_currentPresenceList.length > 0){
                        this.presenceList = [
                            ...this.presenceList,
                            ..._currentPresenceList
                        ];
                    }else{
                        this.allDataRetrieved = true;
                        console.log('All data have been retrieved');
                    }

                    if(this.page == 1){
                        this.initialLoading = false;
                        this.dateList = response.data.data.dates;
                    }

                } catch (error) {
                    this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
                } finally{
                    this.$emit('isLoading', false);
                    this.loadNewPresence = false;
                    console.log('finished retrieveing new set of presence')
                }
            },
            async handleScroll(e){
                const scrollHeight = e.target.scrollHeight;
                const scrollTop = e.target.scrollTop;
                const heightLeft = scrollHeight - scrollTop;

                if(heightLeft < 2000 && !this.loadNewPresence && !this.allDataRetrieved){
                    this.page ++
                    console.log('retrieveing new set of presence')
                    await this.fetchPresenceData()
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
    .presence-note-type-1{
        color:gold;
    }
    .presence-note-type-2{
        color:firebrick
    }
    .presence-note-type-3{
        color:black
    }
</style>