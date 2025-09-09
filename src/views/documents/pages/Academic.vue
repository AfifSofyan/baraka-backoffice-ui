<template>
  <!-- <v-card 
      v-if="academicData.AcademicReportItems.length > 0"
      class="mb-6 pa-4"
  >
      <v-table
          density="compact"
          class="mb-4"
      >
          <thead>
              <th style="width:30px"><p class="font-12">No</p></th>
              <th style="width:60px"><p class="font-12">Hari</p></th>
              <th style="width:70px"><p class="font-12">Tanggal</p></th>
              <th style="width:50px"><p class="font-12">Jam Mulai</p></th>
              <th style="width:50px"><p class="font-12">Jam Selesai</p></th>
              <th style="width:50px"><p class="font-12">Mode</p></th>
              <th style="width:80px"><p class="font-12">Tutor</p></th>
              <th style="width:80px"><p class="font-12">Mata Pelajaran</p></th>
              <th style="width:120px"><p class="font-12">Topik</p></th>
              <th><p class="font-12">Catatan Hasil Pembelajaran</p></th>
          </thead>
          <tbody>
              <tr v-for="(item, index) in form.AcademicReportItems">
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ index + 1 }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ days_list.find(day => day.DayOfTheWeek == moment(item.Date).day()).Name }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ $root.formatDate(item.Date) }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ $root.formatTime(item.TimeStart) }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ $root.formatTime(item.TimeEnd) }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.ModeName }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.TutorName }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.SubjectName }}</p></td>
                  <td class="px-0 align-top py-2"><p class="font-12 text-center">{{ item.Topic }}</p></td>
                  <td class="px-1 align-top py-2"><p class="font-12 text-justify">{{ item.Note }}</p></td>
              </tr>
          </tbody>
      </v-table>
  </v-card> -->

  <vue-pdf-viewer 
    :source="output"
    style="height: 100vh; width: 100vw"
    loading-text="Memuat Dokumen"
    rendering-text="Memuat Dokumen"
    @download="downloadPdf"
    
  />

</template>

<script>
import academicReportService from '@/services/academic_report/academicReportService';
import { days_list } from '@/utils/database-static-records/days';
import { grade_list } from '@/utils/database-static-records/grades';
import { logo_single } from '@/utils/base64_assets/logo_single'
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import VuePdfViewer from 'pdf-viewer-vue';
import moment from "moment"


export default {
  components:{
    VuePdfViewer
  },
  data: () => ({
    isAuthorized: false,
    academicData:null,
    grade_list: grade_list,
    days_list: days_list,
    logo_single: logo_single,
    doc: null,

    output: null,
  }),
  computed: {
    uniquePath() {
        return this.$route.params.uniquePath;
    },
  },
  async created(){
    await this.loadData()
    this.previewPDF()
  },
  methods: {
    async loadData(){
      this.academicData = await academicReportService.getAcademicReportDetailByUniqePath(this.uniquePath)

      console.log(this.academicData)

    },
    previewPDF(){

      const pdf = new jsPDF({
      orientation: "portrait",
      unit : "cm",
      format: [35, 46]
      });

      pdf.addImage(this.logo_single, 'PNG', 11, 1, 2, (266/226)*2);
      pdf.setFontSize(25);
      pdf.setFont('Helvetica', 'Bold');
      pdf.text('BARAKA EDUCATION', 13.2, 2.2);
      pdf.setFontSize(13);
      pdf.text('Menggapai Prestasi, Meraih Keberkahan', 13.2, 2.7, {horizontalScale : 1.05});
      pdf.setFontSize(10);
      pdf.setFont('Helvetica', '');
      pdf.text('Komplek Pondok Mulya Melatiwangi, Jl. Bongkor, Desa. Melatiwangi', 16.5, 3.7, {align : 'center'});
      pdf.text('Kecamatan Cilengkrang, Kabupaten Bandung, Jawa Barat', 16.5, 4.15, {align : 'center'});
      pdf.text('+62 822 9852 9889        www.barakaeducation.com', 16.5, 4.6, {align : 'center'});
      pdf.line(0, 5.2, 35, 5.2, 'F');
      pdf.line(0, 5.23, 35, 5.23, 'F');
      pdf.line(0, 5.3, 35, 5.3, 'F');
      pdf.setFontSize(14);
      pdf.setFont('Helvetica', 'Bold');
      pdf.text('LAPORAN PERKEMBANGAN AKADEMIK', 16.5, 6.7, {align:'center'});
      pdf.text('DAN REKAPITULASI PERTEMUAN LES PRIVAT SISWA', 16.5, 7.2, {align:'center'});
      pdf.setFont('Helvetica', '');
      pdf.text('Nama Siswa \t : ' + this.academicData.StudentName, 1.7, 8.5);
      pdf.text('Periode \t\t : ' + `${this.$root.formatDate(this.academicData.StartDate)} — ${this.$root.formatDate(this.academicData.EndDate)}`, 1.7, 9.5);
      pdf.text('Kelas/Sekolah \t : ' + `${this.academicData.GradeName}/${this.academicData.School}`, 32, 8.5, {align:'right'});
      // pdf.text('Program Kursus \t: ' + , 32, 9.5, {align:'right'});

      let columns = [
            {title: "No", dataKey: "index"},
            {title: "Hari", dataKey: "day"}, 
            {title: "Tanggal", dataKey: "date"},
            {title: "Mulai", dataKey: "start"},
            {title: "Selesai", dataKey: "end"},
            {title: "Mode", dataKey: "mode"},
            {title: "Bid. Studi", dataKey: "subject"},
            {title: "Materi Pelajaran", dataKey: "topic"},
            {title: "Catatan Pembelajaran", dataKey: "note"},
            {title: "Nilai", dataKey: "score"},
            {title: "Guru", dataKey: "tutor"},
        ];

        let rows = [
            {
                "index": "No",
                "day": "Hari",
                "date": "Tanggal",
                "start":"Mulai",
                "end":"Selesai",
                "mode":"Mode",
                "subject":"Bid. Studi",
                "topic":"Materi Pelajaran",
                "note":"Catatan Pembelajaran",
                "score":"Nilai",
                "tutor":"Guru"
            },
        ];

        this.academicData.AcademicReportItems.forEach((item, index) => {
          rows.push({
            "index": index + 1,
            "day": this.days_list.find(day => day.DayOfTheWeek == moment(item.Date).day()).Name,
            "date": this.$root.formatDate(item.Date),
            "start": this.$root.formatTime(item.TimeStart),
            "end": this.$root.formatTime(item.TimeEnd),
            "mode": item.ModeName,
            "subject": item.SubjectName,
            "topic": item.Topic,
            "note": item.Note,
            "score": item.Score,
            "tutor": item.TutorName
          })
        })
            
        pdf.autoTable(
          columns, rows, {
              startY: 11.5,
              styles: {
                  fontSize: 11,
                  cellPadding: {top:0.3, right:0.2, bottom:0.3, left:0.2},
              },
              margin: {left: 1},
              showHead: 'never',
              didParseCell: function (data) {
                  if (data.row.index === 0) {
                  data.cell.styles.fillColor = '#f1f9f5';
                  data.cell.styles.textColor = 'black';
                  data.cell.styles.fontStyle = 'bold';
                  }
              },
              columnStyles:{
                  0 : {
                      cellWidth:1.2,
                      halign: "center",
                  },
                  1 : {
                      cellWidth:1.9,
                      halign: "center",
                  },
                  2 : {
                      cellWidth:2,
                      halign: "center",
                  },
                  3 : {
                      cellWidth:1.5,
                      halign: "center",
                  },
                  4 : {
                      cellWidth:1.7,
                      halign: "center",
                  }, 
                  5 : {
                      cellWidth:1.5,
                      halign: "center",
                  },
                  6 : {
                      cellWidth:3,
                      halign: "center",
                  },
                  7 : {
                      cellWidth:4,
                      halign: "center",
                  },
                  8 : {
                      cellPadding: {top: 0.3, right:1, bottom:0.3, left:1},
                      halign: "justify"
                  },
                  9 : {
                      cellWidth:1.5,
                      halign: "center",
                  },
                  10 : {
                      cellWidth : 3.5,
                      halign: "center",
                  },
              }
          }
          
      );
      pdf.autoTable({
          body : [
              [`Bandung, ${this.$root.formatDate(this.academicData.ReportDate, 'longDate')}`],
              ['\n '],
              ['Manajemen Baraka Education']
          ],
          theme : 'plain',
          styles : {
              valign: "middle",
              halign: "right",
              fontSize: 13,

          },

      });

      pdf.setDocumentProperties({
          title: `Laporan Akademik ${this.academicData.StudentName} ${this.$root.formatDate(this.academicData.ReportDate)}`,
          subject: `©${moment().year()} https://barakaeducation.com`,
          author: 'Afif Fadhilah',
          keywords: 'generated jsPDF, javascript, web 2.0, ajax',
          creator: 'Baraka Education'
      });

      const string = pdf.output('datauristring', {filename:`Laporan Akademik ${this.academicData.StudentName} ${this.$root.formatDate(this.academicData.ReportDate)}`});
      const iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
      
      const blob = pdf.output("blob");

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);
    
      this.output = blobUrl;

    //   document.open();
    //   document.write(iframe);
    //   document.close();

      // pdf.save('trial.pdf');
    
    },
    downloadPdf(){
        this.doc.save(`Laporan Akademik ${this.academicData.StudentName} ${this.$root.formatDate(this.academicData.ReportDate)}`)
    }
  }
}
</script>
