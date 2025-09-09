<template>
    <div class="wrapper" :style="smAndDown ? 'left:0' : 'left:220px !important'">
        <v-progress-circular
            indeterminate
            color="secondary"
            :size="120"
        />
    </div>
</template>

<script setup>
  import { useDisplay } from 'vuetify';

  const { smAndDown } = useDisplay();

</script>

<style scoped>
.wrapper{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left:0;
    display:flex;
    align-items: center;
    margin:auto;
    justify-content: center;
    background-color: rgba(0,0,0,0.05);
}

</style>