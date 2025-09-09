<template>
  <!-- <div ref="test" v-show="invoiceData">
    <v-container class="pt-10 pl-4 pr-4" v-if="invoiceData">
    <div class="d-flex justify-space-between" ref="test">
      <div style="width:100px">
        <img height="100" src="@/assets/logo transparent.png"/>
      </div>
      <div class="text-right font-16">
        <p class="font-weight-medium mt-n1">Invoice No: {{ invoiceData.InvoiceCode }}</p>
        <p class="mt-n1">Baraka Education</p>
        <p class="mt-n1">Ujungberung - Bandung</p>
        <p class="mt-n1">+62 822 9852 9889</p>
        <p class="mt-n1">www.barakaeducation.com</p>
      </div>
    </div>

    <div class="mt-6 d-flex justify-space-between font-14">
      <div>
        <p>DITAGIH KEPADA</p>
        <p>{{ greetTitle }} {{ student_name }}</p>
      </div>
      <div>
        <p class="mt-5">Tanggal : {{ $root.formatDate(invoiceData.InvoiceDate) }}</p>
      </div>
    </div>

    <div class="mt-10">
      <v-table
        density="compact"
      >
        <thead>
          <th class="">No</th>
          <th class="text-left pl-4">Komponen Biaya</th>
          <th>Durasi(Menit)</th>
          <th class="text-right pr-4">Biaya per 90 Menit</th>
          <th class="text-right pr-4">Subtotal</th>
        </thead>
        <tbody>
          <tr v-for="(item, index) in invoiceData.InvoiceItems">
            <td class="text-center">{{ index + 1 }}</td>
            <td>{{ item.Name }}</td>
            <td class="text-center">{{ item.Duration }}</td>
            <td class="text-right">
              <p v-if="item.Cost">{{ this.$root.formatRupiah(item.Cost) }}</p>
            </td>
            <td class="text-right">
              {{ this.$root.formatRupiah(item.Subtotal) }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="d-flex justify-end font-14 pr-4" style="width:100%">
      <p class="text-right">Diskon :</p>
      <p class="text-right" style="width:100px" v-if="invoiceData.Discount">{{ this.$root.formatRupiah(invoiceData.Discount) }}</p>
      <p class="text-right" style="width:100px" v-else>{{ this.$root.formatRupiah(0) }}</p>
    </div>
    <div class="d-flex justify-end font-16 font-weight-medium pr-4 mt-2" style="width:100%">
      <p class="text-right">Total :</p>
      <p class="text-right" style="width:100px">{{ this.$root.formatRupiah(invoiceData.Total) }}</p>
    </div>
  </v-container>
  </div>

  <div class="mt-8 d-flex justify-center">
    <v-btn
        color="rgba(173,11,0,255)"
        append-icon="mdi-download-outline"
        elevation="2"
        rounded="lg"
        class="text-white"
        @click="previewPDF()"
    >DOWNLOAD PDF</v-btn>
  </div> -->

  <vue-pdf-viewer 
    :source="output"
    style="height: 100vh; width: 100vw"
    loading-text="Memuat Dokumen"
    rendering-text="Memuat Dokumen"
    @download="downloadPdf"
    
  />

</template>

<script>
import invoiceService from '@/services/invoice/invoiceService';
import { grade_list } from '@/utils/database-static-records/grades';
import { logo } from '@/utils/base64_assets/logo'
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import VuePdfViewer from 'pdf-viewer-vue';


export default {
  components:{
    VuePdfViewer
  },
  data: () => ({
    isAuthorized: false,
    invoiceData:null,
    grade_list: grade_list,
    logo: logo,

    greetTitle: '',
    student_name: '',
    student_grade: '',

    output: null,
    doc: null,
    docTitle: null
  }),
  computed: {
    uniquePath() {
      return this.$route.params.uniquePath;
    },
    download() {
      return this.$route.query.download;
    }
  },
  async created(){
    await this.loadData()
    this.previewPDF()
  },
  methods: {
    async loadData(){
      this.invoiceData = await invoiceService.getInvoiceDetailByUniqePath(this.uniquePath)

      console.log(this.invoiceData)

      this.invoiceData.InvoiceStudents.forEach((student, index) => {
          const studentName = student.StudentName
          const gradeName = this.grade_list.find(grade => grade.ID == student.GradeID).Name

          if(index > 0){
            if(index == this.invoiceData.InvoiceStudents.length - 1){
              this.student_name += ` dan ${studentName}`
              this.student_grade += ` dan ${gradeName}`
            }else{
              this.student_name += `, ${studentName}`
              this.student_grade += `, ${gradeName}`
            }
          }else{
            this.student_name += `${studentName}`
            this.student_grade += `${gradeName}`
          }
        })

        if(this.student_grade === 'Umum'){
          this.greetTitle = 'Bapak/Ibu'
        }else if(this.student_grade === 'Mahasiswa'){
          this.greetTitle = 'Sdr/Sdri'
        }else{
          this.greetTitle = 'Orang Tua/Wali Siswa'
        }

    },
    // async generatePDF() {
    //   this.$nextTick(async () => {
    //     const content = this.$refs.test; // Reference the 'test' element

    //     const options = {
    //       type: 'dataURL'
    //     };

    //     try {
    //       // Capture the content using html2canvas
    //       const output = await html2canvas(content, options);
          
    //       // Convert the canvas data to a data URL
    //       const imgData = output.toDataURL('image/png');

    //       // // Create a link element to trigger the download
    //       // const link = document.createElement('a');
    //       // link.href = imgData;
    //       // link.download = 'content-image.png';
    //       // link.click();

    //       const pdf = new jsPDF({
    //         orientation: 'portrait',
    //         unit: 'mm',
    //         format: 'a4',
    //       });
    //       const imgWidth = 210; // A4 width in mm
    //       const pageHeight = 297; // A4 height in mm
    //       const imgHeight = (output.height * imgWidth) / output.width;
    //       let heightLeft = imgHeight;
    //       let position = 0;

    //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //       heightLeft -= pageHeight;

    //       while (heightLeft >= 0) {
    //         position = heightLeft - imgHeight;
    //         pdf.addPage();
    //         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //         heightLeft -= pageHeight;
    //       }

    //       pdf.save('document.pdf');

    //     } catch (error) {
    //       console.error('Error generating PDF:', error);
    //     }
    //   });

    // },

    previewPDF(){

      const pdf = new jsPDF({
      orientation: "landscape",
      unit : "cm",
      format: [25, 27]
      });

      const rightHeader = {
          x: 25.5,
          y: 2,
          vspace: 0.7
      }

      const rightHeaderLinesX = () => {
          return rightHeader.x;;
      }

      const rightHeaderLinesY = (lineNumber) => {
          const y = rightHeader.y + (lineNumber - 1) * rightHeader.vspace;

          return y;
      }

      pdf.addImage(this.logo, 'PNG', 1, 1, 8, (266/556)*8);
      pdf.setFontSize(13);
      pdf.setFont('Helvetica', 'bold');
      pdf.text('Invoice No: ' + this.invoiceData.InvoiceCode, rightHeaderLinesX(), rightHeaderLinesY(1), {align : 'right'});
      pdf.setFont('Helvetica', 'normal');
      pdf.text('Baraka Education', rightHeaderLinesX(), rightHeaderLinesY(2), {align : 'right'});
      pdf.text('Ujungberung - Bandung', rightHeaderLinesX(), rightHeaderLinesY(3), {align : 'right'});
      pdf.text('+62 822 9852 9889', rightHeaderLinesX(), rightHeaderLinesY(4), {align : 'right'});
      pdf.text('www.barakaeducation.com', rightHeaderLinesX(), rightHeaderLinesY(5), {align : 'right'});
      pdf.setFontSize(12);
      pdf.text('DITAGIH KEPADA', 1.2, rightHeaderLinesY(7));
      pdf.text(`${this.greetTitle} ${this.student_name}`, 1.2, rightHeaderLinesY(8));
      pdf.text('Tanggal :  ' + this.$root.formatDate(this.invoiceData.InvoiceDate, "longDate"), rightHeaderLinesX(), rightHeaderLinesY(8), {align: 'right'});

      let columns = [
          {title: "Komponen Biaya", dataKey: "item"},
          {title: "Total(Menit)", dataKey: "duration"}, 
          {title: "Total Pertemuan", dataKey: "qty"},
          {title: "Biaya per Pertemuan", dataKey: "cost"},
          {title: "Jumlah Biaya", dataKey: "subtotal"},
      ];
      let rows = [
          {"item": "Komponen Biaya", "duration": "Total(Menit)", "qty": "Total Pertemuan", "cost":"Biaya per Pertemuan", "subtotal":"Jumlah Biaya"},
      ];

      this.invoiceData.InvoiceItems.forEach(item => {
        rows.push({
            'item' : item.Name,
            'duration' : item.Duration,
            'qty' : item.Quantity,
            'cost' : this.$root.formatRupiah(item.Cost),
            'subtotal' : this.$root.formatRupiah(item.Subtotal)
        })
      })
          
      pdf.autoTable(
          columns, rows, {
              startY: 7.5,
              styles: {
                  fontSize: 12,
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
                  'item' : {halign:'left', cellWidth: 8},
                  'duration' : {halign:'center'},
                  'qty' : {halign:'center'},
                  'cost' : {halign:'right'},
                  'subtotal' : {halign:'right'}
              }
          }
          
      );

      const totalStartY = pdf.previousAutoTable.finalY;

      const totalLines = (lineNumber) => {
          const vspace = 0.7

          return {
              titleX : 18,
              valueX : 25.5,
              y: totalStartY + (lineNumber * vspace),    
          };    
      }

      pdf.text(this.$root.formatRupiah(this.invoiceData.Discount), totalLines(1).valueX, totalLines(1).y, {align:'right'});
      pdf.setFont('helvetica', 'bold');
      pdf.text('Diskon', totalLines(1).titleX, totalLines(1).y);
      pdf.setFontSize(14);
      pdf.text('Total', totalLines(2).titleX, totalLines(2).y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(this.$root.formatRupiah(this.invoiceData.Total), totalLines(2).valueX, totalLines(2).y, {align:'right'});


      pdf.setProperties({
          title: `Invoice ${this.invoiceData.InvoiceCode}`,
          subject: '©2023 https://barakaeducation.com',
          author: 'Afif Fadhilah',
          keywords: 'generated jsPDF, javascript, vue',
          creator: 'Baraka Education'
      });

      this.docTitle = `Invoice ${this.invoiceData.InvoiceCode} ${this.invoiceData.InvoiceStudents[0].StudentName}`
      
      if(this.download){
        pdf.save(`${this.docTitle}.pdf`);
      }else{
        // const string = pdf.output('datauristring', {filename:docTitle});
        // const iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>";
        
        // document.open();
        // document.write(`<html><head><title>Invoice ${this.invoiceData.InvoiceCode}</title></head><body>${iframe}</body></html>`);
        // document.close();

        const blob = pdf.output("blob");

        // Create a blob URL
        const blobUrl = URL.createObjectURL(blob);
      
        this.output = blobUrl;

        this.doc = pdf
      }

    },
    downloadPdf(){
      this.doc.save(`${this.docTitle}`)
    }
  }
}
</script>
