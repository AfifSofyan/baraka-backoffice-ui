<template>
    <v-app>
      <!-- Header Section -->
      <v-app-bar
        color="white"
      >
        <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown"  variant="text" @click.stop="drawer = !drawer"/>
        <div 
          v-if="$vuetify.display.mdAndUp"
          style="width:40px"
          class="ml-4"
        >
          <v-img height="40" src="@/assets/logo transparent.png"/>
        </div>
        <p class="text-h6 font-weight-regular ml-4">Baraka Education</p>
        

        <v-spacer></v-spacer>

        <template v-if="$vuetify.display.mdAndUp">
          <v-btn variant="text" class="text-teal-darken-1" @click="$refs.about.scrollIntoView({behavior: 'smooth'})">About</v-btn>
          <v-btn variant="text" class="text-teal-darken-1" @click="$refs.program.scrollIntoView({behavior: 'smooth'})">Program</v-btn>
          <v-btn variant="text" class="text-teal-darken-1" @click="$refs.pricing.scrollIntoView({behavior: 'smooth'})">Biaya</v-btn>
          <v-btn variant="text" class="text-teal-darken-1" @click="$refs.testimony.scrollIntoView({behavior: 'smooth'})">Testimoni</v-btn>
          <v-btn variant="text" class="text-teal-darken-1" @click="$refs.documentation.scrollIntoView({behavior: 'smooth'})">Dokumentasi</v-btn>
        </template>

      </v-app-bar>

      <v-navigation-drawer
        v-if="$vuetify.display.smAndDown"
        v-model="drawer"
        :location="$vuetify.display.smAndDown ? 'left' : undefined"
        temporary
      >
      <v-list density="compact">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
          @click="goToSection(item.value)"
        >
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>

      <div height="200" class="my-8"></div>
  
      <!-- Hero Section -->
      <div ref="about" class="hero-section py-4 py-sm-8 py-md-16">
        <!-- Background Image with Blur Effect -->
        <div class="background-image">
          <v-img 
            src="@/assets/illustration.jpg"
            absolute
            min-width="600"
            class="blurred-image"
            position="center"
          />
        </div>

        <!-- Text Content in Front -->
        <div class="hero-content px-2 px-sm-6 px-md-16">
          <h1 class="text-h5 text-sm-h4 text-md-h3 text-white mb-4 mb-sm-8 mb-md-12 font-weight-bold">Les Privat Profesional & Islami</h1>
          <p class="text-body-2 text-sm-body-1 text-md-h6 mb-4 mb-sm-8 mb-md-10">
            Baraka Education merupakan lembaga pendidikan les privat SD-SMP-SMA-UTBK sejak tahun 2018 yang menggunakan konsep pembelajaran interaktif secara tatap muka ataupun online dan siap membantu Ananda dalam menggapai prestasi. Tutor berpengalaman dari ITB, Unpad, UPI, UIN, UI, UGM serta Perguruan Tinggi lainnya yang siap datang ke rumah ataupun belajar online via zoom/meet
          </p>
          <v-btn
            
            height="50"
            width="200"
            rounded="lg"
            @click="openRegistrationLink"
            color="blue-darken-1"
            class="text-white mt-4 mt-sm-8 mt-md-10"
          >Daftar Sekarang</v-btn>
        </div>
      </div>
  
      <!-- Features Section -->
      <v-container class="my-10">
        <v-row v-if="$vuetify.display.smAndDown">
          <v-col cols="12">
            <v-card elevation="0 py-4 px-8">
              <h3 class="text-h5 font-weight-bold mb-4">Mengapa Memilih Les di Baraka Education?</h3>
              <ul style="list-style-type: none">
                <li class="text-h6 font-weight-light mb-4"><v-icon color="teal-darken-2">mdi-account-tie</v-icon> Pengajar berkualitas, profesional, dan Islami</li>
                <li class="text-h6 font-weight-light mb-4"><v-icon color="teal-darken-2">mdi-book-sync-outline</v-icon> Sinkronisasi Pelajaran</li>
                <li class="text-h6 font-weight-light mb-4"><v-icon color="teal-darken-2">mdi-calendar-search-outline</v-icon> Jadwal Fleksibel</li>
                <li class="text-h6 font-weight-light mb-4"><v-icon color="teal-darken-2">mdi-comment-question</v-icon> Konsultasi Online dan Offline</li>
                <li class="text-h6 font-weight-light mb-4"><v-icon color="teal-darken-2">mdi-hand-coin</v-icon> Biaya Terjangkau</li>
              </ul>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="6">
            <h3 class="text-h4 font-weight-bold">Mengapa Memilih Les di Baraka Education?</h3>
          </v-col>
          <v-col cols="6">
            <ul style="list-style-type: none">
              <li v-motion-slide-visible-right class="text-h5 font-weight-light mb-6"><v-icon color="teal-darken-2">mdi-account-tie-outline</v-icon> Pengajar berkualitas, profesional, dan Islami</li>
              <li v-motion-slide-visible-right class="text-h5 font-weight-light mb-6"><v-icon color="teal-darken-2">mdi-book-sync-outline</v-icon> Sinkronisasi Pelajaran</li>
              <li v-motion-slide-visible-right class="text-h5 font-weight-light mb-6"><v-icon color="teal-darken-2">mdi-calendar-search-outline</v-icon> Jadwal Fleksibel</li>
              <li v-motion-slide-visible-right class="text-h5 font-weight-light mb-6"><v-icon color="teal-darken-2">mdi-comment-question-outline</v-icon> Konsultasi Online dan Offline</li>
              <li v-motion-slide-visible-right class="text-h5 font-weight-light mb-6"><v-icon color="teal-darken-2">mdi-hand-coin-outline</v-icon> Biaya Terjangkau</li>
            </ul>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Programs Section -->
      <div ref="program"></div>
      <div class="mt-10 px-0 px-md-8 py-8 bg-teal-lighten-1" v-motion-slide-visible-once-bottom>
        <h2 class="text-h5 text-md-h4 font-weight-medium text-white text-center mb-6">Pilih Program Terbaik Kami Sesuai dengan Kebutuhan Buah Hati Anda</h2>

        <v-sheet
          class="mx-auto bg-teal-lighten-1"
          
        >
          <v-slide-group
            v-model="model"
            class="pa-0"
            selected-class="bg-success"
            show-arrows
          >
            <v-slide-group-item
              v-for="(program, index) in programs"
              :key="index"
            >
              <v-card
                class="ma-4"
                elevation="8"
                color="blue-lighten-5"
                height="300"
                width="250"
                :subtitle="program.subtitle"
              >
                <template v-slot:prepend>
                  <!-- <v-icon color="secondary" :icon="program.icon"></v-icon> -->
                  <v-img v-if="program.slug == 'regular'" width="40" src="@/assets/books.png"/>
                  <v-img v-if="program.slug == 'utbk'" width="40" src="@/assets/college.png"/>
                  <v-img v-if="program.slug == 'btq'" width="40" src="@/assets/quran.png"/>
                  <v-img v-if="program.slug == 'jarimatika'" width="40" src="@/assets/fingers.png"/>
                  <v-img v-if="program.slug == 'bahasa'" width="40" src="@/assets/flags.png"/>
                </template>
                <template v-slot:title>
                  <span class="text-h6 font-weight-regular">{{ program.title }}</span>
                </template>

                <v-card-text class="pt-8 text-body-1 bg-grey-lighten-2" style="height:100%">
                  {{ program.description }}
                </v-card-text>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>

      <!-- Pricing List -->

      <div ref="pricing"></div>
      <div class="px-12 py-28 mb-10" v-motion-slide-visible-left>
        <div style="height: 70px"></div>
        <div>
          <v-img width="500px" class="ml-n6 mb-10" src="@/assets/disc10.png"/>
        </div>
        <v-row>
          <v-col cols="12">
            <v-list class="bg-grey-lighten-2">
              <v-list-item-group>
                <template v-for="(plan, index) in pricingPlans" :key="index">
                  <!-- Main List Item -->
                  <v-list-item @click="toggleExpand(index)">
                    <div class="d-flex">
                      <v-list-item-content style="width:250px">
                        <v-list-item-title>{{ plan.title }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon>
                        <v-icon>{{ expandedIndex === index ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                      </v-list-item-icon>
                    </div>
                  </v-list-item>

                  <!-- Expandable Details -->
                  <v-expand-transition>
                    <v-card v-if="expandedIndex === index" class="pa-4 mt-2">
                      <v-container>
                        <v-row v-if="$vuetify.display.mdAndUp">
                          <!-- Three Columns -->
                          <v-col cols="4">
                            <h4 class="text-left pl-4">Jumlah Pertemuan</h4>
                            <v-list dense>
                              <v-list-item v-for="type in types" :key="type">
                                <v-list-item-content>
                                  <v-list-item-title>{{ type }}</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-col>
                          <v-col cols="4">
                            <h4 class="text-center">Online</h4>
                            <v-row>
                              <v-col cols="6">
                                <v-list dense>
                                  <v-list-item
                                    v-for="(value, index) in getOnlineStrokePrices(plan)"
                                    :key="index"
                                  >
                                    <v-list-item-content>
                                      <v-list-item-title class="text-center text-decoration-line-through text-red">{{ value }}</v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-col>
                              <v-col cols="6">
                                <v-list dense>
                                  <v-list-item
                                    v-for="(value, index) in getOnlinePrices(plan)"
                                    :key="index"
                                  >
                                    <v-list-item-content>
                                      <v-list-item-title class="text-center">{{ value }}</v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col cols="4">
                            <h4 class="text-center">Offline</h4>
                            <v-row>
                              <v-col cols="6">
                                <v-list dense>
                                  <v-list-item
                                    v-for="(value, index) in getOfflineStrokePrices(plan)"
                                    :key="index"
                                  >
                                    <v-list-item-content>
                                      <v-list-item-title class="text-center text-decoration-line-through text-red">{{ value }}</v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-col>
                              <v-col cols="6">
                                <v-list dense>
                                  <v-list-item
                                    v-for="(value, index) in getOfflinePrices(plan)"
                                    :key="index"
                                  >
                                    <v-list-item-content>
                                      <v-list-item-title class="text-center">{{ value }}</v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        <!-- Three Columns -->

                        <!-- Mobile -->
                        <v-row v-else>
                          <v-col cols="12">
                            <h4 class="text-center">Online</h4>
                            <v-list dense>
                              <v-list-item
                                v-for="(value, index) in getOnlinePrices(plan)"
                                :key="index"
                                class="pa-0"
                              >
                                <v-list-item-content>
                                  <p class="text-left">{{ (index + 1) * 4 }} Pertemuan : <span class="text-decoration-line-through text-red">{{ getOnlineStrokePrices(plan)[index] }}</span> {{ value }}</p>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-col>
                          <v-col cols="12">
                            <h4 class="text-center">Offline</h4>
                            <v-list dense>
                              <v-list-item
                                v-for="(value, index) in getOfflinePrices(plan)"
                                :key="index"
                                class="pa-0"
                              >
                                <v-list-item-content>
                                  <p class="text-left">{{ (index + 1) * 4 }} Pertemuan : <span class="text-decoration-line-through text-red">{{ getOfflineStrokePrices(plan)[index] }}</span> {{ value }}</p>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                        <!-- Mobile -->
                      </v-container>
                    </v-card>
                  </v-expand-transition>
                </template>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </div>
  
      <!-- Testimonials Section -->
      <div ref="testimony"></div>
      <div class="my-10 px-0 px-md-8 py-8 bg-blue-lighten-4" v-motion-slide-visible-once-bottom>
        <h2 class="text-h5 text-md-h4 font-weight-medium text-grey-darken-4 text-center mb-6">Apa kata mereka setelah les di Baraka Education?</h2>

        <v-sheet
          class="mx-auto bg-blue-lighten-4"
        >
          <v-slide-group
            v-model="model"
            class="pa-0"
            selected-class="bg-success"
            show-arrows
          >
            <v-slide-group-item
              v-for="(testimoni, index) in testimonies"
              :key="index"
            >
              <v-card
                class="ma-4"
                elevation="8"
                color="blue-lighten-5"
                height="250"
                width="250"
                :subtitle="testimoni.school"
              >
                <template v-slot:prepend>
                  <v-img width="20" src="@/assets/quote.png"/>
                </template>
                <template v-slot:title>
                  <span class="text-h6 font-weight-regular">{{ testimoni.author }}</span>
                </template>

                <v-card-text class="pt-8 font-italic text-body-1 bg-grey-lighten-5" style="height:100%;">
                  <p style="font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;">{{ testimoni.text }}</p>
                </v-card-text>
              </v-card>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </div>

      <div ref="documentation"></div>
      <v-row v-motion-slide-visible-once-bottom class="mt-16">
        <v-col cols="1" sm="2" md="3"></v-col>
        <v-col cols="10" sm="8" md="6">
          <div class="youtube-container">
            <iframe
              src="https://www.youtube.com/embed/gPJIN8cUn00"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </v-col>
        <v-col cols="1" sm="2" md="3"></v-col>
      </v-row>
  
      <!-- Call to Action Section -->
      <v-container class="my-10 text-center">
        <h2 class="text-h5">Ayo belajar bersama Kami di Baraka Education</h2>
        <p>Kami siap melayani Anda di wilayah Bandung dan Jabodetabek secara offline, dan seluruh wilayah Indonesia secara online.</p>
        <v-btn color="primary" class="mt-4" @click="openRegistrationLink">Daftar Sekarang</v-btn>
      </v-container>
  
      <!-- Partners Section -->
      <v-container class="my-10 text-center">
        <h2 class="text-h5 mb-8">Baraka Education telah mengajar siswa dari berbagai sekolah dan perguruan tinggi seperti:</h2>
        <v-row>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/akmil.png" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/itb.png" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/the_university_of_manchester.png" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/unisba.png" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/upn_jakarta.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/unpar.png" height="100"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/sma_alfacentauri.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/smp_alfacentauri.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/tarunabakti.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/avicenna.png" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/cikal.png" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/darul_hikam.png" height="100"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/bandung_islamic_school.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/cendekia_muda.png" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/pribadi_bilingual_school.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/smm.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/kuttab_ummulquro.jpg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/smp_alirsyad.png" height="100"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/sdit qurani sorowako.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/kinderfield_bekasi.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/olifant_school.webp" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/global_islamic_school.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/sman_3_bandung.jpeg" height="100"/>
          </v-col>
          <v-col cols="4" sm="2">
            <v-img src="@/assets/schools/sman_2_bandung.png" height="100"/>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Footer Section -->
      <div class="mt-8 py-16 px-8 bg-blue-lighten-1">
        <v-row>
          <v-col cols="12" md="6">
            <p class="mb-5"><v-icon class="mr-4">mdi-map-marker</v-icon> Pondok Mulya Melatiwangi, Ujungberung - Bandung</p>
            <p class="mb-5"><v-icon class="mr-4">mdi-email-outline</v-icon> info@barakaeducation.com</p>
            <p><v-icon class="mr-4">mdi-phone</v-icon> Info Pendaftaran: +6285159522751</p>
          </v-col>
          <v-col cols="12" md="6">
            <p class="text-left text-md-right mb-5">© 2024 Baraka Education. All rights reserved.</p>
            <p class="text-left text-md-right">
              <v-icon class="mr-8" @click="goToYoutube">mdi-youtube</v-icon>
              <v-icon class="mr-8" @click="goToFacebook">mdi-facebook</v-icon>
              <v-icon class="mr-8" @click="goToInstagram">mdi-instagram</v-icon>
              <v-icon class="" @click="goToWhatsapp">mdi-whatsapp</v-icon>
            </p>

          </v-col>
        </v-row>
      </div>
    </v-app>
  </template>
  
  <script>
  import '@iframe-resizer/child';

  export default {
    data() {
      return {
        drawer: false,
        group: null,
        items: [
          {
            title: 'About',
            value: 'about',
          },
          {
            title: 'Program',
            value: 'program',
          },
          {
            title: 'Biaya',
            value: 'pricing',
          },
          {
            title: 'Testimoni',
            value: 'testimony',
          },
          {
            title: 'Dokumentasi',
            value: 'documentation',
          },
        ],
        programs: [
          { title: "Privat SD — SMA", slug:"regular", subtitle:"Semua Mata Pelajaran", description: "Program reguler dimana siswa akan dibimbing lebih memahami materi-materi yang telah diberikan di sekolah, memberikan bimbingan dalam mengerjakan tugas dan ujian sekolah" },
          { title: "Persiapan UTBK", slug:"utbk", subtitle:"Ujian Tulis Berbasis Komputer", description: "Program intensif untuk persiapan ujian akhir, dengan strategi belajar yang tepat untuk memaksimalkan potensi siswa mencapai nilai terbaik" },
          { title: "Les BTQ", slug:"btq", subtitle:"Baca Tulis Qur`an", description: "Pada program ini siswa akan mempelajari materi-materi dasar membaca Al-Quran dari dasar hingga mahir dalam membaca & memahami Al- Qur`an." },
          { title: "Les Jarimatika", slug:"jarimatika", subtitle:"@jarimania", description: "Pada program ini siswa akan belajar berhitung cepat matematika hanya menggunakan jari yang didampingi oleh Guru berkompeten di bidangnya."},
          { title: "Kelas Bahasa", slug:"bahasa", subtitle:"Inggris, Arab, Jepang", description: "Program ini terdiri dari tingkat basic, intermediate, & advance. Sehingga siswa dapat menguasai materi baik dari segi verbal, audio, & visual dengan baik." }
        ],
        expandedIndex: null, // Tracks the expanded item index
        types: ["4 × Pertemuan", "8 × Pertemuan", "12 × Pertemuan", "16 × Pertemuan"],
        pricingPlans: [
          {
            title: "TK & SD",
            slug: "tksd",
            onlineBasic: "Rp 468.000",
            onlineStrokeBasic: "Rp 520.000",
            onlineStandard: "Rp 936.000",
            onlineStrokeStandard: "Rp 1.040.000",
            onlineGoal: "Rp 1.404.000",
            onlineStrokeGoal: "Rp 1.560.000",
            onlineChamp: "Rp 1.872.000",
            onlineStrokeChamp: "Rp 2.080.000",
            offlineBasic: "Rp 522.000",
            offlineStrokeBasic: "Rp 580.000",
            offlineStandard: "Rp 1.000.000",
            offlineStrokeStandard: "Rp 1.160.000",
            offlineGoal: "Rp 1.566.000",
            offlineStrokeGoal: "Rp 1.740.000",
            offlineChamp: "Rp 2.088.000",
            offlineStrokeChamp: "Rp 2.320.000"
          },
          {
            title: "SMP",
            slug: "smp",
            onlineBasic: "Rp 504.000",
            onlineStrokeBasic: "Rp 560.000",
            onlineStandard: "Rp 1.008.000",
            onlineStrokeStandard: "Rp 1.120.000",
            onlineGoal: "Rp 1.512.000",
            onlineStrokeGoal: "Rp 1.680.000",
            onlineChamp: "Rp 2.016.000",
            onlineStrokeChamp: "Rp 2.240.000",
            offlineBasic: "Rp 558.000",
            offlineStrokeBasic: "Rp 620.000",
            offlineStandard: "Rp 1.116.000",
            offlineStrokeStandard: "Rp 1.240.000",
            offlineGoal: "Rp 1.674.000",
            offlineStrokeGoal: "Rp 1.860.000",
            offlineChamp: "Rp 2.232.000",
            offlineStrokeChamp: "Rp 2.480.000",
          },
          {
            title: "SMA",
            slug: "sma",
            onlineBasic: "Rp 540.000",
            onlineStrokeBasic: "Rp 600.000",
            onlineStandard: "Rp 1.080.000",
            onlineStrokeStandard: "Rp 1.200.000",
            onlineGoal: "Rp 1.620.000",
            onlineStrokeGoal: "Rp 1.800.000",
            onlineChamp: "Rp 2.160.000",
            onlineStrokeChamp: "Rp 2.400.000",
            offlineBasic: "Rp 594.000",
            offlineStrokeBasic: "Rp 660.000",
            offlineStandard: "Rp 1.188.000",
            offlineStrokeStandard: "Rp 1.320.000",
            offlineGoal: "Rp 1.782.000",
            offlineStrokeGoal: "Rp 1.980.000",
            offlineChamp: "Rp 2.376.000",
            offlineStrokeChamp: "Rp 2.640.000",
          },
          {
            title: "UTBK/Mahasiswa",
            slug: "sma",
            onlineBasic: "Rp 702.000",
            onlineStrokeBasic: "Rp 780.000",
            onlineStandard: "Rp 1.404.000",
            onlineStrokeStandard: "Rp 1.560.000",
            onlineGoal: "Rp 2.106.000",
            onlineStrokeGoal: "Rp 2.340.000",
            onlineChamp: "Rp 2.808.000",
            onlineStrokeChamp: "Rp 3.120.000",
            offlineBasic: "Rp 756.000",
            offlineStrokeBasic: "Rp 840.000",
            offlineStandard: "Rp 1.512.000",
            offlineStrokeStandard: "Rp 1.680.000",
            offlineGoal: "Rp 2.268.000",
            offlineStrokeGoal: "Rp 2.520.000",
            offlineChamp: "Rp 3.024.000",
            offlineStrokeChamp: "Rp 3.360.000",
          },
          {
            title: "Jarimatika",
            slug: "jarimatika",
            onlineBasic: "Rp 468.000",
            onlineStrokeBasic: "Rp 520.000",
            onlineStandard: "Rp 936.000",
            onlineStrokeStandard: "Rp 1.040.000",
            onlineGoal: "Rp 1.404.000",
            onlineStrokeGoal: "Rp 1.560.000",
            onlineChamp: "Rp 1.872.000",
            onlineStrokeChamp: "Rp 2.080.000",
            offlineBasic: "Rp 522.000",
            offlineStrokeBasic: "Rp 580.000",
            offlineStandard: "Rp 1.000.000",
            offlineStrokeStandard: "Rp 1.160.000",
            offlineGoal: "Rp 1.566.000",
            offlineStrokeGoal: "Rp 1.740.000",
            offlineChamp: "Rp 2.088.000",
            offlineStrokeChamp: "Rp 2.320.000"
          },
          {
            title: "Baca Tulis Qur`an",
            slug: "btq",
            onlineBasic: "Rp 468.000",
            onlineStrokeBasic: "Rp 520.000",
            onlineStandard: "Rp 936.000",
            onlineStrokeStandard: "Rp 1.040.000",
            onlineGoal: "Rp 1.404.000",
            onlineStrokeGoal: "Rp 1.560.000",
            onlineChamp: "Rp 1.872.000",
            onlineStrokeChamp: "Rp 2.080.000",
            offlineBasic: "Rp 522.000",
            offlineStrokeBasic: "Rp 580.000",
            offlineStandard: "Rp 1.000.000",
            offlineStrokeStandard: "Rp 1.160.000",
            offlineGoal: "Rp 1.566.000",
            offlineStrokeGoal: "Rp 1.740.000",
            offlineChamp: "Rp 2.088.000",
            offlineStrokeChamp: "Rp 2.320.000"
          },
        ],
        testimonies: [          
          {
              text: "Alhamdulillah Ghani akhirnya keterima di FTI ITB 2021 di 14 Juni Kemarin. Terima kasih yah kak Ilmu dan Doanya",
              author: "Ananda Ghani",
              school: "Alumni SMA Alfa Centaury Bandung"
          },
          {
              text: "Alhamdulillah kami puas dengan pelayanan dan tentor-tentor dari Baraka. Anaknya sopan-sopan, ramah dan pinter-pinter",
              author: "Bunda Fathan Rafi",
              school: "Kelas 9, SMP 8 Muhammadiyah Bandung"
          },
          {
              text: "Alhamdulillah, Terima kasih banyak. Aden diterima di Fakultas Kedokteran Unpad. Terima kasih banyak atas bimbingan guru pengajar Baraka",
              author: "Bunda Ektada Aden",
              school: "Alumni SMA Alfa Centaury Bandung"
          },
          {
              text: "Alhamdulillah Fayyadh dapat peringkat terbaik untuk pelajaran Bahasa Inggris di Kelasnya",
              author: "Bunda Fayyadh",
              school: "Kelas 8, SMPN 17 Bandung"
          },
          {
              text: "Alhamdulillah Danish bilang cocok diajari oleh Kak Ridha",
              author: "Bunda Danish",
              school: "Kelas 4 SD, Bandung Islamic School"
          },
          {
              text: "Alhamdulillah anak saya cocok dengan gurunya kak Zainal",
              author: "Bunda Bimo",
             school: "Kelas 8, SMP Darul Hikam Bandung"
          }
        ]
        
      };
    },
    methods: {
      goToSection(section){
        this.$refs[section].scrollIntoView({behavior:'smooth'})
        this.drawer = false
      },
      toggleExpand(index) {
        // Toggles the expansion state of the clicked item
        this.expandedIndex = this.expandedIndex === index ? null : index;
      },
      getDetails(plan) {
        // Exclude title and slug keys for display
        const { title, slug, ...details } = plan;
        return details;
      },
      formatKey(key) {
        // Format keys to be user-friendly
        return key.replace(/([A-Z])/g, " $1").replace(/online|offline/, (match) =>
          match.charAt(0).toUpperCase() + match.slice(1)
        );
      },
      getOnlinePrices(plan) {
        // Extract online prices in the same order as types
        return [
          plan.onlineBasic,
          plan.onlineStandard,
          plan.onlineGoal,
          plan.onlineChamp,
        ];
      },
      getOnlineStrokePrices(plan){
        return [
          plan.onlineStrokeBasic,
          plan.onlineStrokeStandard,
          plan.onlineStrokeGoal,
          plan.onlineStrokeChamp,
        ]
      },
      getOfflinePrices(plan) {
        // Extract offline prices in the same order as types
        return [
          plan.offlineBasic,
          plan.offlineStandard,
          plan.offlineGoal,
          plan.offlineChamp,
        ];
      },
      getOfflineStrokePrices(plan){
        return [
          plan.offlineStrokeBasic,
          plan.offlineStrokeStandard,
          plan.offlineStrokeGoal,
          plan.offlineStrokeChamp,
        ]
      },
      openRegistrationLink(){
        window.open("https://api.whatsapp.com/send/?phone=6285159522751&text&app_absent=0", "_blank")
      },
      goToYoutube(){
        window.open('https://www.youtube.com/channel/UCU_TTS1bRECC8uYAz6-rD6Q', '_blank')
      },
      goToFacebook(){
        window.open('https://www.facebook.com/barakaprivat/?_rdc=2&_rdr', '_blank')
      },
      goToInstagram(){
        window.open('https://www.instagram.com/barakaeducation/?ighsid=YmMyMTA2M2Y%3D', '_blank')
      },
      goToWhatsapp(){
        window.open('https://api.whatsapp.com/send/?phone=6285159522751&text&app_absent=0', '_blank')
      },
    },
  };
  </script>
  
  <style scoped>
  h1, h2, h3 {
    color: #2a4d69;
  }
  
  .hero-section {
    position: relative;
    overflow: hidden;
    width: 100vw; /* Full-width of the container */
  }

  .background-image {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    overflow: hidden;
    width: 100vw;
  }

  .blurred-image {
    filter: blur(0px);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    color: white;
    text-align: center;
    text-shadow: 2px 2px 3px rgba(100,100,100);
    padding: 20px;
    border-radius: 8px; /* Optional styling */
  }
  
  .youtube-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; /* Aspect Ratio */
    height: 0;
  }
  .youtube-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  </style>
  