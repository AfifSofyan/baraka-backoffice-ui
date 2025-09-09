<template>
    <v-container>
        <BrkTitle 
            title="Dashboard"
            color="primary"
            class="mb-2"
        />


        <v-container v-if="['superadmin', 'admin'].includes(roleName) && info" class="mt-8">
            <v-row class="mb-10">
                <v-col>
                    <div style="height:250px" class="d-flex justify-center">
                        <div>
                            <p class="text-body-2">Klasifikasi Siswa Berdasarkan Status</p>
                            <Pie :data="studentChartData"/>
                        </div>
                    </div>
                </v-col>
                <v-col>
                    <div style="height:250px" class="d-flex justify-center">
                        <div>
                            <p class="text-body-2">Klasifikasi Tutor Berdasarkan Jadwal</p>
                            <Pie :data="tutorChartData"/>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Jadwal Les Mingguan" variant="tonal" append-icon="mdi-calendar-multiselect-outline">
                        <v-card-text class="text-h5">{{ info.totalSchedules }}</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Kelas Berjalan Bulan Ini" variant="tonal" append-icon="mdi-human-male-board">
                        <v-card-text class="text-h5" v-if="info.totalClassesComparison.differences >= 0">{{ info.totalClassesComparison.totalClassesThisMonth }} <v-icon color="secondary" class="ml-6 mr-1 mb-n4 pb-5">mdi-triangle-small-up</v-icon>{{ info.totalClassesComparison.differences }}</v-card-text>
                        <v-card-text class="text-h5" v-if="info.totalClassesComparison.differences < 0">{{ info.totalClassesComparison.totalClassesThisMonth }} <v-icon color="danger" class="ml-6 mr-1 mb-n4 pb-5">mdi-triangle-small-down</v-icon>{{ Math.abs(info.totalClassesComparison.differences) }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-container v-if="roleName == 'student' && info" class="mt-8">
            <v-card
                v-if="incomingClass"
                color="secondary" 
                class="mb-n2"
                variant="tonal"
                prepend-icon="mdi-book"
                title="Kelas Berikutnya"
            >
            </v-card>
            <v-card 
                v-if="incomingClass"
                color="secondary" 
                class="mb-5" 
                variant="tonal"
                :title="`${info.incomingClass.SubjectName}`"
                :subtitle="`Bersama Tutor: ${info.incomingClass.TutorName}`"
            >
                <v-card-text>
                <v-row justify="center">
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.days }}</div>
                    <div>Hari</div>
                    </v-col>
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.hours }}</div>
                    <div>Jam</div>
                    </v-col>
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.minutes }}</div>
                    <div>Menit</div>
                    </v-col>
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.seconds }}</div>
                    <div>Detik</div>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>


            <v-row>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Jadwal Les Mingguan" variant="tonal" append-icon="mdi-calendar-multiselect-outline">
                        <v-card-text class="text-h5">{{ info.totalSchedules }}</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Tutor" variant="tonal" append-icon="mdi-human-male-board">
                        <v-card-text class="text-h5">{{ info.totalTutors }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Kelas Berjalan Bulan Ini" variant="tonal" append-icon="mdi-calendar-check-outline">
                        <v-card-text class="text-h5">{{ info.totalClasses }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-container v-if="roleName == 'tutor' && info" class="mt-8">
            <v-card
                v-if="incomingClass"
                color="secondary" 
                class="mb-n2"
                variant="tonal"
                prepend-icon="mdi-book"
                title="Kelas Berikutnya"
            >
            </v-card>
            <v-card 
                v-if="incomingClass"
                color="secondary" 
                class="mb-5" 
                variant="tonal"
                :title="`${info.incomingClass.SubjectName}`"
                :subtitle="`Siswa: ${info.incomingClass.StudentName}`"
            >
                <v-card-text>
                <v-row justify="center">
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.days }}</div>
                    <div>Hari</div>
                    </v-col>
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.hours }}</div>
                    <div>Jam</div>
                    </v-col>
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.minutes }}</div>
                    <div>Menit</div>
                    </v-col>
                    <v-col cols="3" sm="2" class="text-center">
                    <div class="text-h5">{{ incomingClass.seconds }}</div>
                    <div>Detik</div>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>


            <v-row>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Jadwal Les Mingguan" variant="tonal" append-icon="mdi-calendar-multiselect-outline">
                        <v-card-text class="text-h5">{{ info.totalSchedules }}</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Siswa" variant="tonal" append-icon="mdi-account-school">
                        <v-card-text class="text-h5">{{ info.totalStudents }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6">
                    <v-card color="primary" subtitle="Total Kelas Berjalan Bulan Ini" variant="tonal" append-icon="mdi-calendar-check-outline">
                        <v-card-text class="text-h5">{{ info.totalClasses }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

    </v-container>
</template>

<script>
import dashboardService from "@/services/dashboard/dashboardService.js"
import moment from "moment"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import BrkTitle from "@/components/pages/BrkTitle.vue"

ChartJS.register(ArcElement, Tooltip, Legend)

export default{
    data(){
        return{
            info: null,
            roleName : JSON.parse(localStorage.getItem('roleName')),
            nickname : JSON.parse(localStorage.getItem('nickname')),

            studentChartData: null,
            tutorChartData: null,

            incomingClass: null,
            countdownInterval: null,
        }
    },
    components:{
        BrkTitle,
        Pie,
    },
    mounted(){
        this.startCountdown()
    },
    created(){
        this.getDashboardInformation()
    },
    methods:{
        async getDashboardInformation(){
            try {
                const data = await dashboardService.getDashboardInformation()

                this.info = data.data

                if(['admin','superadmin'].includes(this.roleName)){
                    this.studentChartData = {
                        labels: ['Aktif', 'Libur', 'Off'],
                        datasets:[
                            {
                                backgroundColor: ['#84ceac', '#FDDA0D', '#D22B2B'],
                                data:[
                                    this.info.studentStatusClassification.aktif,
                                    this.info.studentStatusClassification.libur,
                                    this.info.studentStatusClassification.off,
                                ]
                            }
                        ]
                    }

                    this.tutorChartData = {
                        labels: ['Ada Jadwal', 'Tidak Ada Jadwal'],
                        datasets:[
                            {
                                backgroundColor: ['#84ceac', '#33bcea'],
                                data:[
                                    this.info.tutorClassification.totalTutorsWithSchedule,
                                    this.info.tutorClassification.totalTutorsWithoutSchedule,
                                ]
                            }
                        ]
                    }
                }

            } catch (error) {
                this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
            }
        },
        startCountdown() {
            if(['admin','superadmin'].includes(this.roleName)){
                return
            }
            this.countdownInterval = setInterval(() => {
                const currentTime = moment();
                const futureTime = moment(this.info.incomingClass.datetime, 'YYYY-MM-DD HH:mm:ss');
                const duration = moment.duration(futureTime.diff(currentTime));
                
                this.incomingClass = {
                    days : Math.floor(duration.asDays()),
                    hours : duration.hours(),
                    minutes : duration.minutes(),
                    seconds : duration.seconds()
                }
                
                if (duration.asMilliseconds() <= 0) {
                    clearInterval(this.countdownInterval);
                }
            }, 1000);
        }
    }
}
</script>