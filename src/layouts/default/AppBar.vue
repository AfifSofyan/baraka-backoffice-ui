<template>
  <v-app-bar style="position: fixed">
    <v-app-bar-nav-icon @click="toggleDrawer" v-if="useToggle"></v-app-bar-nav-icon>
    <div style="width:40px" class="ml-4" v-if="!useToggle">
      <v-img height="40" src="@/assets/logo transparent.png"/>
    </div>
    <v-app-bar-title v-if="!useToggle" class="font-bold">
      Baraka Education
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-menu
      location="bottom end"
    >
      <template v-slot:activator="{ props }">
        <v-badge 
          v-if="notifications.length > 0"
          color="#d82c2c" 
          offset-x="10" 
          offset-y="8"
          :content="notifications.length"
        >
          <v-btn icon v-bind="props">
            <v-icon>mdi-bell</v-icon>
          </v-btn>    
        </v-badge>
        <v-btn v-else icon v-bind="props">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
      </template>
      <div class="d-flex justify-end">
      </div>
      <v-list lines="3" width="300">
        <v-list-item>
          <div class="d-flex justify-end" v-if="notifications.length > 0">
            <v-btn flat class="font-10 text-primary" @click="markAllNotificationsAsRead">
              Tandai Semua Telah Dibaca
            </v-btn>            
          </div>      
          <div v-else>
            <p class="font-12 text-primary text-center">Tidak Ada Notifikasi Baru</p>
          </div>     
        </v-list-item>
        <v-list-item
          v-for="(notification, i) in notifications"
          :key="i"
          :value="notification"
          @click="goToDetailNotification(notification)"
        >
          <template v-slot:prepend>
            <v-icon :icon="notification.Icon"></v-icon>
          </template>

          <v-list-item-title v-text="notification.Title"></v-list-item-title>
          <v-list-item-subtitle v-text="notification.Text"></v-list-item-subtitle>
        </v-list-item>
        <v-divider class="mt-2"/>
        <v-list-item>
          <div class="d-flex justify-center">
            <v-btn flat @click="goToNotificationList">
              <p class="text-center text-primary">Tampilkan Semua</p>
            </v-btn>
          </div>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn icon @click="logout">
      <v-icon>mdi-logout-variant</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import authService from '@/services/auth/authService';
import notificationService from '@/services/notification/notificationService';
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  props: ['useToggle'],
  setup() {
    const notifications = ref([]);
    const router = useRouter();
    const route = useRoute();

    const getUnreadNotifications = async () => {
      try {
        const _notifications = await notificationService.getUnreadNotifications();
        notifications.value = _notifications.data;

      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    // Initial fetch, replaces `created()`
    onMounted(() => {
      getUnreadNotifications();
    });

    // Watch route changes and refetch notifications
    watch(
      () => route.fullPath,
      async () => {
        await getUnreadNotifications();
      }
    );

    return {
      notifications,
      getUnreadNotifications
    };
  },
  methods: {
    toggleDrawer() {
      this.$emit('toggleDrawer');
    },
    goToNotificationList(){
      this.$router.push('/backoffice/notification');
    },
    async markAllNotificationsAsRead(){
      
      try {
        await notificationService.markAllNotificationsAsRead()
        await this.getUnreadNotifications()
      } catch (error) {
        this.$root.showSnackbar(error.message)
      }
    },
    async logout() {
      try {
        await authService.logout();
        this.$router.push('/login');
      } catch (error) {
        this.$root.showSnackbar(error.message);
      }
    },
    goToDetailNotification(notification){
      this.$router.push(`/backoffice/notification/${notification.ID}`);
    }
  },
};
</script>
