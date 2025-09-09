/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VDatePicker } from 'vuetify/labs/VDatePicker'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components:{
    VDataTable,
    VDatePicker
  },
  theme: {
    themes: {
      light: {
        colors: {
          // primary: '#84ceac',
          primary: '#00674f',
          secondary: '#33bcea',
          lighter: 'rgba(122, 222, 255, .3)',
          white: '#ffffff',
          gray: '#a9a9a9',
          danger: 'ff0e0e'
        },
      },
    },
  },
  defaults:{
    VTextField: {
      density:'compact'
    },
    VAutocomplete: {
      density:'compact'
    },
    VFileInput: {
      density:'compact'
    },
    VSelect: {
      density:'compact'
    },
    VTextArea: {
      variant:'outlined'
    }
  }
})
