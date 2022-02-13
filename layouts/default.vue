<template>
<div id="app" class="default">
  <Sidebar id="sidebar" :visible="true" :dismissable="false" :modal="false" :showCloseIcon="false">
    <div class="header">
      <h1 class="font-rust text-center">rpm <span>Server administration dashboard</span></h1>
    </div>
    <div class="content">
      <div class="navigation">
        <Accordion :activeIndex="activeIndex">
          <AccordionTab v-for="(server, index) in servers" :key="index" :header="server.address + ':' + server.port">
            <ul>
              <li>
                <NuxtLink :to="'/' + server.address + ':' + server.port + '/manage'">
                  Manage
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="'/' + server.address + ':' + server.port + '/players'">
                  Players
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="'/' + server.address + ':' + server.port + '/files'">
                  Files
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="'/' + server.address + ':' + server.port + '/'">
                  Schedules - Coming soon
                </NuxtLink>
              </li>
            </ul>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
    <div class="bottom-sidebar p-d-flex p-flex-column p-ai-center">
      <NuxtLink class="" to="/add">
        <Button class="p-button-info">
          Add server
        </Button>
      </NuxtLink>
      <a href="https://www.buymeacoffee.com/_leon" target="_blank" class="support p-mt-3">Support my work</a>
      <a href="https://github.com/leona/rustpm-admin" target="_blank" class="support p-mt-3 p-mb-3">Source code</a>
    </div>
  </Sidebar>
  <div class="page-content">
    <Nuxt />
  </div>
</div>
</template>

<script>
import OverlayPanel from 'primevue/overlaypanel';
import { capitalise } from '../utilities/string.js'
import { getTitle } from '../utilities/extensions.js'
import Sidebar from 'primevue/sidebar';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { mapState } from 'vuex'

export default {
  components: {
    Sidebar, Accordion, AccordionTab
  },
  head() {
    return {
      title: this.title,
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.title},
      ],
    }
  },
  mounted() {
    if (this.$route.params.server) {
      this.activeIndex = Object.keys(this.servers).indexOf(this.$route.params.server)
    }
  },
  data() {
    return {
      paths: [],
      activeIndex: 0
    }
  },
  methods: {
    setPaths() {
      this.paths = this.$route.path.split('/').filter(x => x.length)
    },
    getPath(index) {
      let path = [''].concat(this.paths.slice(0, index + 1)).join('/')
      return path
    },
    normalisePath(string) {
      return capitalise(string)
    }
  },
  computed: {
    ...mapState('server', ['servers']),
    isMobile() {
      return this.width <= 900
    },
    title() {
      return getTitle.bind(this)()
    }
  },
  watch: {
    $route() {
      this.setPaths()
      if (window.location.protocol == "https:") {
        window.location = document.URL.replace("https://", "http://");
      }
    },
  },
};
</script>
<style lang="scss">
  .default {
    #sidebar {
      .support {
        text-decoration:underline;
        text-align:center;
        display:block
      }
      .p-accordion-content {
        padding-top:0
      }
      .p-sidebar-header {
        display:none !important;
      }

      > .p-sidebar-content {
        padding:0
      }

      .header {
       /* background: #343434;*/

        h1 {
          margin:0;
          padding:20px 0;
          font-size:50px;

          span {
            font-family: $body-font;
            display:block;
            font-size:15px;
            font-weight:300;
            color:rgba(255,255,255,0.5)
          }
        }
      }

      .navigation {
        ul {
          padding:0;
          margin:0;
          margin-left:10px;
          list-style: none;

          a {
            padding: 10px;
            margin-bottom:3px;
            display:block;

            &:hover {
              opacity:0.7
            }
          }
        }
      }
    }
    .bottom-sidebar {
      position:absolute;
      bottom:0;
      width:100%
    }
    .p-sidebar-content {
      height:100%;
    }
    .control-btn {
      background: #005081;
      display: block;
      padding: 13px 0;
      text-align: center;
      font-weight: 600;
      margin-bottom: 1px;
    }
    .page-content {
      margin-left:22rem;
      margin-right:1rem;
      margin-top:2rem
    }
  }
</style>