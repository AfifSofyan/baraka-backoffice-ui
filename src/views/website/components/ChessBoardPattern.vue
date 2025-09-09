<template>
    <div class="pattern-shape chess-board">
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>

        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>

        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>

        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>

        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>

        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
        <div class="dark"></div>
        <div class="light"></div>
    </div>
</template>

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

    // Dynamic row-n classes
    @for $i from 1 through 10 {
        .row-#{$i} {
        top: #{50 * ($i - 1)}px;
        }
    }

    .pattern-container {
        position: relative;
        background-color: var(--background-color);
        --shape-size: 50px; /* Default shape size is 50px */
    }

    .color-tone-1 {
        --shape-color: #f0f0f0; /* Tomato color */
        --background-color: white;
        
        background-color: var(--background-color);
    }

    .pattern-background {
        height: calc(var(--shape-size));
        position: absolute;
        display: flex;
    }

    .pattern-shape {
        background-color: var(--shape-color);
        width: calc(var(--shape-size));
        height: calc(var(--shape-size));
    }

    // classes for chess board pattern
    .chess-board{
        display:grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
    .dark{
        width:calc(var(--shape-size) / 6);
        height:calc(var(--shape-size) / 6);
        background-color: var(--shape-color);
    }
    .light{
        width: calc(var(--shape-size) / 6);
        height: calc(var(--shape-size) / 6);
        background-color: var(--background-color);
    }

</style>