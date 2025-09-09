<template>
    <v-btn v-if="hasDetail" elevation="0" density="compact" color="primary" size="22" class="mx-1" @click="() => $emit('handleDetailClick')">
        <v-icon class="color-white" size="13">mdi-eye-outline</v-icon>
    </v-btn>
    <v-btn v-if="hasEdit" elevation="0" density="compact" color="primary" size="22" class="mx-1" @click="() => $emit('handleEditClick')" :disabled="disableEdit">
        <v-icon class="color-white" size="13">mdi-pencil-outline</v-icon>
    </v-btn>
    <v-btn v-if="hasSend" variant="tonal" density="compact" color="secondary" size="22" class="mx-1" @click="() => $emit('handleSendClick')">
        <v-icon size="13">mdi-send-outline</v-icon>
    </v-btn>
    <v-btn v-if="hasUnsend" variant="tonal" density="compact" color="secondary" size="22" class="mx-1" @click="() => $emit('handleUnsendClick')">
        <v-icon size="13">mdi-refresh</v-icon>
    </v-btn>
    <v-btn v-if="hasSave" variant="tonal" density="compact" color="gray" size="22" class="mx-1" @click="() => $emit('handleSaveClick')">
        <v-icon size="13">mdi-content-save</v-icon>
    </v-btn>
    <v-btn v-if="hasCopy" variant="tonal" density="compact" color="secondary" size="22" class="mx-1" @click="() => $emit('handleCopyClick')">
        <v-icon size="13">mdi-content-copy</v-icon>
    </v-btn>
    <v-btn v-if="hasDownload" variant="tonal" density="compact" color="secondary" size="22" class="mx-1" @click="() => $emit('handleDownloadClick')">
        <v-icon size="13">mdi-download</v-icon>
    </v-btn>
    <v-btn v-if="hasDelete" variant="tonal" density="compact" color="danger" size="22" class="mx-1" @click="() => $emit('handleDeleteClick')" :disabled="disableDelete">
        <v-icon size="13">mdi-trash-can-outline</v-icon>
    </v-btn>
</template>

<script>
export default{
    emits:['handleDetailClick', 'handleEditClick', 'handleSendClick', 'handleUnsendClick', 'handleSaveClick', 'handleDownloadClick', 'handleCopyClick', 'handleDeleteClick'],
    props:{
        hasDetail:{
            type:Boolean
        },
        hasEdit:{
            type:Boolean
        },
        hasSend:{
            type:Boolean
        },
        hasUnsend:{
            type:Boolean
        },
        hasDownload:{
            type:Boolean
        },
        hasCopy:{
            type:Boolean
        },
        hasSave:{
            type:Boolean
        },
        hasDelete:{
            type:Boolean
        },
        disableEdit:{
            type:Boolean
        },
        disableDelete:{
            type:Boolean
        }
    },
}
</script>