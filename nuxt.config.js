export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'rustpm admin',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'RPM Server administration dashboard' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og:type', property: 'og:type', content: "website"},
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
    ]
  },
  ssr: false,
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '@/node_modules/primevue/resources/primevue.min.css' },
    { src: '@/node_modules/primevue/resources/themes/md-dark-indigo/theme.css' },
    { src: '@/node_modules/primeflex/primeflex.min.css' },
    { src: '@/node_modules/primeicons/primeicons.css' },
      { src: 'assets/scss/main.scss' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '~/components',
  //  { path: '~/node_modules/primevue', level: 0, ignore: ['chart', "tree", "treetable", "tristatecheckbox", "toolbar"] }
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  plugins: [
  ],

  primevue: {
    theme: 'md-dark-indigo',
    ripple: true,
    components: [
      'Accordion',
      'AccordionTab',
      'Breadcrumb',
      'Button',
      'SelectButton',
      'MegaMenu',
      'Dialog',
      'Dropdown',
      'InputText',
      'Checkbox',
      'Menubar',
      'Menu',
      'Paginator',
      'ProgressBar',
      'Card',
      'Avatar',
      'Message',
    ]
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'primevue/nuxt',
    '@nuxtjs/style-resources',
    '@nuxtjs/axios',
    '@nuxtjs/toast',
  ],

  styleResources: {
    scss: ['./assets/scss/variables.scss']
  },

  router: {
    fallback: true
  },
  
  server: {
    port: process.env.PORT
  },

  axios: {
    baseURL: process.env.API_URL
  },

  publicRuntimeConfig: {
    baseURL: process.env.API_URL
  },

  target: 'static',
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
