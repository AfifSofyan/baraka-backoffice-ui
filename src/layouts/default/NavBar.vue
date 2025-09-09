<template>
  <div>
    <div class="d-flex ml-4 ma-6">
      <div class="mr-1">
        <v-icon size="40" color="primary">
          mdi-account
        </v-icon>
      </div>
      <div>
        <h4>{{ name }}</h4>
        <span class="d-block font-italic" style="font-size:12px">{{ roleName == 'student' ? 'siswa' : roleName }}</span>
      </div>
    </div>

    <hr class="ml-4 mr-4 mt-6" style="border-top: 2px solid gray"/>
    <hr class="ml-4 mr-4" style="border-top: 1px solid gray"/>

    <v-list v-model:opened="open">
      <div v-for="(menu, menuIndex) in menuList" :key="menuIndex">
        <v-list-group v-if="menu.submenu && menu.submenu.length > 0" :value="menu.name">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              rounded="lg"
              class="menu"
              :class="{ active: menu.path == path }"
              @click="redirectTo(menu.path)"
            >
              <v-icon 
                class="icon"
                :class="{ active: menu.path == path }"
              >{{ menu.icon }}</v-icon>
              {{ menu.name }}
            </v-list-item>
          </template>

          <v-list-item
            v-for="(submenu, submenuIndex) in menu.submenu"
            :key="submenuIndex"
            rounded="lg"
            class="submenu"
            :value="submenu.name"
            :class="{ active: submenu.path == path }"
            @click="redirectTo(submenu.path)"
          >
            <v-icon 
              class="icon"
              :class="{ active: submenu.path == path }"
            >{{ submenu.icon }}</v-icon>
            {{ submenu.name }}
          </v-list-item>
        </v-list-group>

        <v-list-item v-else
          rounded="lg"
          class="menu"
          :class="{ active: menu.path == path }"
          @click="redirectTo(menu.path)"
        >
          <v-badge 
            color="#d82c2c" 
            offset-x="5" 
            v-if="menu.name == 'Siswa' && totalNewStudentRegistrants > 0" 
            :content="totalNewStudentRegistrants"
          >
            <v-icon 
              class="icon"
              :class="{ active: menu.path == path }"
            >{{ menu.icon }}</v-icon>
          </v-badge>
          <v-badge 
            color="#d82c2c" 
            offset-x="5" 
            v-else-if="menu.name == 'Tutor' && totalNewTutorRegistrants > 0" 
            :content="totalNewTutorRegistrants"
          >
            <v-icon 
              class="icon"
              :class="{ active: menu.path == path }"
            >{{ menu.icon }}</v-icon>
          </v-badge>
          <v-icon 
              v-else
              class="icon"
              :class="{ active: menu.path == path }"
            >{{ menu.icon }}</v-icon>
          {{ menu.name }}
        </v-list-item>
      </div>
    </v-list>

    <div class="my-4">
      <p class="text-center text-caption">version {{ appVersion }}</p>
    </div>
  </div>
</template>

<script>
  import { EventBus } from '@/eventBus';
  import packageJson from '../../../package.json'
  import studentService from '@/services/student/studentService'
  import tutorService from '@/services/tutor/tutorService'
  import newRegisterTone from '@/assets/tones/new_register.wav'


  export default{
    data(){
      return {
        menuList : JSON.parse(localStorage.getItem('menuList')) || [],
        name : JSON.parse(localStorage.getItem('name')),
        nickname : JSON.parse(localStorage.getItem('nickname')),
        roleName : JSON.parse(localStorage.getItem('roleName')),
        profilePicture: localStorage.getItem('profilePicture') ? `${JSON.parse(localStorage.getItem('profilePicture'))}` : 'default.svg',

        totalNewStudentRegistrants: 0,
        totalNewTutorRegistrants: 0,


        newRegisterTone: new Audio(newRegisterTone),

        open: [],
        path: this.$route.path,
        appVersion: packageJson.version


      }
    },
    watch: {
      $route(to, from) {
        this.path = to.path;
        this.resetMenuList();
        this.open = [];
        this.setExpandedMenu();
      }
    },
    mounted(){
      this.resetMenuList()
      this.setExpandedMenu()
      if(this.roleName == 'superadmin'){
        this.getTotalNewRegistrants()
        this.intervalId = setInterval(this.getTotalNewRegistrants, 10 * 60 * 1000)
      }

      EventBus.on('CheckTotalNewRegistrants', this.getTotalNewRegistrants)
    },
    beforeUnmount() {
      EventBus.off('CheckTotalNewRegistrants', this.getTotalNewRegistrants)
      if(this.roleName == 'superadmin'){
        clearInterval(this.intervalId)
      }
    },
    beforeDestroy() {
      if(this.roleName == 'superadmin'){
        clearInterval(this.intervalId)
      }
    },
    methods: {
      resetMenuList (){
        this.menuList = JSON.parse(localStorage.getItem('menuList')) || [];
      },
      setExpandedMenu(){
        this.menuList.forEach(menu => {
          menu.submenu.forEach(submenu => {
            if(submenu.path == this.path){
              this.open = [menu.name]
              return
            }
          })
        })
      },
      redirectTo(path){
        if (path) {
          this.$router.push(path);
        }
      },
      async getTotalNewRegistrants(){
        await this.getTotalNewStudentRegistrants()
        await this.getTotalNewTutorRegistrants()
      },
      async getTotalNewStudentRegistrants(){
        try{
            const data = await studentService.getTotalNewRegistrants()

            if(data.data.TotalNewRegistrants > this.totalNewStudentRegistrants){
              // this.newRegisterTone.play()
            }

            this.totalNewStudentRegistrants = data.data.TotalNewRegistrants

        } catch (error) {
            this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
        }
      },
      async getTotalNewTutorRegistrants(){
        try{
            const data = await tutorService.getTotalNewRegistrants()

            if(data.data.TotalNewRegistrants > this.totalNewStudentRegistrants){
              // this.newRegisterTone.play()
            }

            this.totalNewTutorRegistrants = data.data.TotalNewRegistrants

        } catch (error) {
            this.$root.showSnackbar(error.response ? error.response.data.message : error.message)
        }
      }
    }
  }
</script>

<style scoped>
  .menu{
    font-size: 14px;
  }
  ::v-deep .v-list-item__content{
    overflow: visible;
    
  }
  .submenu{
    font-size: 14px;
    padding-left: 28px !important;
  }
  .icon{
    /* color: #84ceac; */
    color: #00674f;
    margin-right: 8px;
  }
  .active{
    /* background-color: #84ceac; */
    background-color: #00674f;
    color: white !important;
  }
</style>
