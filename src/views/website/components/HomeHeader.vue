<template>
    <div>
        <div class="pattern-container color-tone-1 d-none d-md-block" style="height:500px; --shape-size: 50px">
            <div class="pattern-background">
                <div class="pattern-shape pie-slice-top-left"></div>
                <div class="pattern-shape arc-90-top-right"></div>
                <div class="pattern-shape hollow-square"></div>
                <div class="pattern-shape right-triangle-top-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-left-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape arc-90-top-right"></div>
                <div class="pattern-shape corner-leaf-up"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape hollow-square stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
            </div>
            <div class="pattern-background row-2">
                <div class="pattern-shape pie-slice-bottom-left"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-bottom-left-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-left-hypotenuse stripe-diagonal-n45"></div>
                <div class="pattern-shape"></div>
                <div class="pattern-shape pie-slice-bottom-right"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape corner-leaf-up"></div>
                <div class="pattern-shape stripe-vertical"></div>
            </div>
            <div class="pattern-background row-3">
                <div class="pattern-shape right-triangle-top-left-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-right-hypotenuse stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-bottom-left-hypotenuse stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
            </div>
            <v-row class="pattern-background row-4">
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape hollow-square"></div>
                <ChessBoardPattern/>
                <div class="pattern-shape right-triangle-top-left-hypotenuse"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape pie-slice-top-left"></div>
            </v-row>
            <div class="pattern-background row-5">
                <div class="pattern-shape pie-slice-top-right"></div>
                <ChessBoardPattern/>
                <div class="pattern-shape hollow-square"></div>
            </div>

            <v-row>
                <v-col cols="12" sm="6">
                    <div style="width:80%" class="mt-12 pt-12">
                        <v-img src="@/assets/home-image.png"/>
                    </div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="pr-8 py-16 mt-16">
                        <h3 class="text-center text-md-right text-h3 color-secondary font-weight-regular mt-2" style="text-shadow:1px 1px 2px gray">BARAKA <span class="color-primary">EDUCATION</span></h3>
                        <h4 class="text-center text-md-right text-h4 color-primary font-weight-medium mt-2" style="text-shadow:1px 1px 2px gray">LES PRIVAT <span class="color-secondary">PROFESIONAL & ISLAMI</span></h4>
                        <div class="d-flex justify-center justify-md-end mt-4">
                            <v-btn
                                height="50"   
                                width="220"
                                rounded="lg"
                                v-motion-slide-visible-bottom
                                @click="openRegistrationLink"
                                color="blue-darken-1"
                                class="text-white"
                            >Daftar Sekarang</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>

        <div class="pattern-container color-tone-1 d-none d-sm-block d-md-none" style="height:250px; --shape-size: 40px">
            <div class="pattern-background">
                <div class="pattern-shape pie-slice-top-left"></div>
                <div class="pattern-shape arc-90-top-right"></div>
                <div class="pattern-shape hollow-square"></div>
                <div class="pattern-shape right-triangle-top-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-left-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape arc-90-top-right"></div>
                <div class="pattern-shape corner-leaf-up"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape hollow-square stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
            </div>
            <div class="pattern-background row-2">
                <div class="pattern-shape pie-slice-bottom-left"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-bottom-left-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-left-hypotenuse stripe-diagonal-n45"></div>
                <div class="pattern-shape"></div>
                <div class="pattern-shape pie-slice-bottom-right"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape corner-leaf-up"></div>
                <div class="pattern-shape stripe-vertical"></div>
            </div>
            <div class="pattern-background row-3">
                <div class="pattern-shape right-triangle-top-left-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-right-hypotenuse stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-bottom-left-hypotenuse stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
            </div>
            <v-row class="pattern-background row-4">
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape hollow-square"></div>
                <ChessBoardPattern/>
                <div class="pattern-shape right-triangle-top-left-hypotenuse"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape pie-slice-top-left"></div>
            </v-row>
            <div class="pattern-background row-5">
                <div class="pattern-shape pie-slice-top-right"></div>
                <ChessBoardPattern/>
                <div class="pattern-shape hollow-square"></div>
            </div>

            <v-row>
                <v-col cols="12" sm="6">
                    <div style="width:80%" class="mt-12 pt-12">
                        <v-img src="@/assets/home-image.png"/>
                    </div>
                </v-col>
                <v-col cols="12" sm="6">
                    <div class="pr-8 py-8 mt-8">
                        <h3 class="text-center text-sm-right text-h4 color-secondary font-weight-regular mt-2" style="text-shadow:1px 1px 2px gray">BARAKA <span class="color-primary">EDUCATION</span></h3>
                        <h4 class="text-center text-sm-right text-h5 color-primary font-weight-medium mt-2" style="text-shadow:1px 1px 2px gray">LES PRIVAT <span class="color-secondary">PROFESIONAL & ISLAMI</span></h4>
                        <div class="d-flex justify-center justify-sm-end mt-4">
                            <v-btn
                                height="50"   
                                width="220"
                                rounded="lg"
                                v-motion-slide-visible-bottom
                                @click="openRegistrationLink"
                                color="blue-darken-1"
                                class="text-white"
                            >Daftar Sekarang</v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </div>

        <div class="pattern-container color-tone-1 d-block d-sm-none" style="height:180px; --shape-size: 30px">
            <div class="pattern-background">
                <div class="pattern-shape pie-slice-top-left"></div>
                <div class="pattern-shape arc-90-top-right"></div>
                <div class="pattern-shape hollow-square"></div>
                <div class="pattern-shape right-triangle-top-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-left-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape arc-90-top-right"></div>
                <div class="pattern-shape corner-leaf-up"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape hollow-square stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
            </div>
            <div class="pattern-background row-2">
                <div class="pattern-shape pie-slice-bottom-left"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-bottom-left-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-left-hypotenuse stripe-diagonal-n45"></div>
                <div class="pattern-shape"></div>
                <div class="pattern-shape pie-slice-bottom-right"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape corner-leaf-up"></div>
                <div class="pattern-shape stripe-vertical"></div>
            </div>
            <div class="pattern-background row-3">
                <div class="pattern-shape right-triangle-top-left-hypotenuse"></div>
                <div class="pattern-shape right-triangle-top-right-hypotenuse stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
                <div class="pattern-shape right-triangle-bottom-left-hypotenuse stripe-diagonal-45"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse"></div>
            </div>
            <v-row class="pattern-background row-4">
                <div class="pattern-shape right-triangle-bottom-right-hypotenuse stripe-vertical"></div>
                <div class="pattern-shape hollow-square"></div>
                <ChessBoardPattern/>
                <div class="pattern-shape right-triangle-top-left-hypotenuse"></div>
                <div class="pattern-shape corner-leaf-down"></div>
                <div class="pattern-shape pie-slice-top-left"></div>
            </v-row>
            <div class="pattern-background row-5">
                <div class="pattern-shape pie-slice-top-right"></div>
                <ChessBoardPattern/>
                <div class="pattern-shape hollow-square"></div>
            </div>

            <div>
                <v-row>
                    <v-col cols="12" sm="6">
                        <div style="width:90%" class="mt-2 pt-2">
                            <v-img src="@/assets/home-image.png"/>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6" class="bg-blue-lighten-5">
                        <div class="px-4 py-16">
                            <h3 class="text-center text-md-right text-h4 color-secondary font-weight-regular" style="text-shadow:1px 1px 2px gray">BARAKA <span class="color-primary">EDUCATION</span></h3>
                            <h4 class="text-center text-md-right text-h5 color-primary font-weight-medium mt-2" style="text-shadow:1px 1px 2px gray">LES PRIVAT <span class="color-secondary">PROFESIONAL & ISLAMI</span></h4>
                            <div class="d-flex justify-center justify-md-end mt-4">
                                <v-btn
                                    height="50"   
                                    width="220"
                                    rounded="lg"
                                    v-motion-slide-visible-bottom
                                    @click="openRegistrationLink"
                                    transition="scroll-y-reverse-transition"
                                    color="blue-darken-1"
                                    class="text-white"
                                >Daftar Sekarang</v-btn>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </div>
    </div>
</template>

<script>
import ChessBoardPattern from './ChessBoardPattern.vue';

export default {
    data() {
      return {
        
      };
    },
    components:{
        ChessBoardPattern
    },
    methods:{
      openRegistrationLink(){
        console.log('test')
      }
    }
  };
</script>

<style lang="scss" scoped>
    :root {
    --shape-color: #004c38; /* Shape color */
    --background-color: aquamarine; /* Background color */
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .pattern-container {
        position: relative;
        background-color: var(--background-color);
        --shape-size: 50px; /* Default shape size is 50px */
    }

    // Dynamic row-n classes
    @for $i from 1 through 10 {
        .row-#{$i} {
        top: calc(var(--shape-size) * #{$i - 1});
        }
    }

    .color-tone-1 {
        --shape-color: #f0f0f0;
        --background-color: white;
        background-color: var(--background-color);
    }

    .color-tone-2 {
        --shape-color: #1d8566;
        --background-color: #037755;
        background-color: var(--background-color);
    }

    .pattern-background {
        height: var(--shape-size);
        position: absolute;
        display: flex;
    }

    .pattern-shape {
        background-color: var(--shape-color);
        width: var(--shape-size);
        height: var(--shape-size);
    }

    /* Example of different shapes */

    .circle {
        border-radius: 50%; /* Circle */
    }

    .pie-slice-top-right {
        clip-path: circle(100% at 0% 100%);
        background: repeating-radial-gradient(
            circle at left bottom, 
            rgba(0,0,0,0), rgba(0,0,0,0) calc(var(--shape-size) / 2), 
            var(--shape-color) calc(var(--shape-size) / 2), var(--shape-color) calc(var(--shape-size))
        );
    }

    .pie-slice-top-left {
        clip-path: circle(100% at 100% 100%);
        background: repeating-radial-gradient(
            circle at right bottom, 
            rgba(0,0,0,0), rgba(0,0,0,0) calc(var(--shape-size) / 2), 
            var(--shape-color) calc(var(--shape-size) / 2), var(--shape-color) calc(var(--shape-size))
        );
    }

    .pie-slice-bottom-right {
        clip-path: circle(100% at 0% 0%);
        background: repeating-radial-gradient(
            circle at left top, 
            rgba(0,0,0,0), rgba(0,0,0,0) calc(var(--shape-size) / 2), 
            var(--shape-color) calc(var(--shape-size) / 2), var(--shape-color) calc(var(--shape-size))
        );
    }

    .pie-slice-bottom-left {
        clip-path: circle(100% at 100% 0%);
        background: repeating-radial-gradient(
            circle at right top, 
            rgba(0,0,0,0), rgba(0,0,0,0) calc(var(--shape-size) / 2), 
            var(--shape-color) calc(var(--shape-size) / 2), var(--shape-color) calc(var(--shape-size))
        );
    }

    .dshaped {
        border-radius: 0 calc(var(--shape-size)) calc(var(--shape-size)) 0;
    }

    .right-triangle-top-right-hypotenuse {
        clip-path: polygon(0% 0%, 0% 100%, 100% 100%);
    }

    .right-triangle-top-left-hypotenuse {
        clip-path: polygon(0% 100%, 100% 0%, 100% 100%);
    }

    .right-triangle-bottom-right-hypotenuse {
        clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
    }

    .right-triangle-bottom-left-hypotenuse {
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
    }

    .diamond {
        clip-path: polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%);
    }

    .diamond-square-hollow {
        clip-path: polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%);
        background: rgba(0, 0, 0, 0);
        border: calc(var(--shape-size) / 5) solid var(--shape-color);
    }

    .circle-hollow {
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0);
        border: solid calc(var(--shape-size) / 5) var(--shape-color);
    }

    .arc-90-top-right {
        border-radius: 0% 100% 0% 0%;
    }

    .arc-90-top-left {
        border-radius: 100% 0% 0% 0%;
    }

    .arc-90-bottom-left {
        border-radius: 0% 0% 0% 100%;
    }

    .arc-90-bottom-right {
        border-radius: 0% 0% 100% 0%;
    }

    .corner-leaf-up {
        border-radius: 100% 0% 100% 0%;
    }

    .corner-leaf-down {
        border-radius: 0% 100% 0% 100%;
    }

    .hollow-square {
        background-color: rgba(0, 0, 0, 0);
        border: solid calc(var(--shape-size) / 5) var(--shape-color);
    }

    .shape-12 {
        clip-path: polygon(0% 0%, 0% 100%, 100% 100%);
    }

    .stripe-diagonal-45 {
        background: repeating-linear-gradient(
            45deg, 
            var(--shape-color), var(--shape-color) calc(var(--shape-size) / 10), 
            rgba(0, 0, 0, 0) calc(var(--shape-size) / 10), rgba(0, 0, 0, 0) calc(var(--shape-size) / 5)
        );
    }

    .stripe-diagonal-n45 {
        background: repeating-linear-gradient(
            135deg, 
            var(--shape-color), var(--shape-color) calc(var(--shape-size) / 10), 
            rgba(0, 0, 0, 0) calc(var(--shape-size) / 10), rgba(0, 0, 0, 0) calc(var(--shape-size) / 5)
        );
    }

    .stripe-horizontal {
        background: repeating-linear-gradient(
            0deg, 
            var(--shape-color), var(--shape-color) calc(var(--shape-size) / 10), 
            rgba(0, 0, 0, 0) calc(var(--shape-size) / 10), rgba(0, 0, 0, 0) calc(var(--shape-size) / 5)
        );
    }

    .stripe-vertical {
        background: repeating-linear-gradient(
            90deg, 
            var(--shape-color), var(--shape-color) calc(var(--shape-size) / 10), 
            rgba(0, 0, 0, 0) calc(var(--shape-size) / 10), rgba(0, 0, 0, 0) calc(var(--shape-size) / 5)
        );
    }
</style>