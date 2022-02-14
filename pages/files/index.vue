<template>
  <div class="files-page">
    <div class="p-card p-p-5">
      <Button class="p-button-info add-file" @click="onAddFile">Add file</Button>
      <TabView :activeIndex.sync="activeIndex">
        <TabPanel v-for="(group, key) in files" :key="key" :header="capitalise(key)">
          <DataTable :value="group" dataKey="path" :loading="loading">
            <Column field="path" header="Path"></Column>
            <Column field="lastUpdated" header="Last modified"></Column>
            <Column field="size" header="Size"></Column>
            <Column>
              <template #body="slotProps">
                <NuxtLink :to="{ path: '/files/edit', query: { group: key, path: slotProps.data.path, server: $route.query.server }}">
                  <Button type="button" class="p-button-info p-mr-2" icon="pi pi-code"></Button>
                </NuxtLink>
                <Button type="button" class="p-button-danger" icon="pi pi-trash" @click="onDeleteFile(key, slotProps.data.path)"></Button>
              </template>
            </Column>
            <template #empty>
                No records found.
            </template>
          </DataTable>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { mapState } from 'vuex'
import { capitalise } from '../../utilities/string'

export default {
  computed: {
    ...mapState('server', ['server']),
  },
  components: {
    DataTable, Column, TabView, TabPanel
  },
  data() {
    return {
      loading: false,
      files: {},
      activeIndex: 0,
      selectedGroup: null
    }
  },
  mounted() {
    if (this.server.address) {
      this.fetchFiles()
    }
  },
  methods: {
    onAddFile() {
      let group = Object.keys(this.files)[this.activeIndex]
      this.$router.push({
        path: '/files/edit',
        query: { group, server: this.$route.query.server }
      })
    },
    onDeleteFile(group, path) {
      if (!confirm(`Are you sure you want to delete ${path}?`)) return

      this.$rustpm.delete('file', { group, path }).then(() => {
        this.$toast.error(`Deleted ${path}`, {
            position: "bottom-right",
            duration : 5000
        })

        this.fetchFiles()
      }).catch(() => {
        this.$toast.info(`Failed to delete ${path}`, {
            position: "bottom-right",
            duration : 5000
        })
      })
    },
    capitalise(value) {
      return capitalise(value)
    },
    fetchFiles() {
      this.$rustpm.get('files').then((response) => {
        console.log("Got files:", response.data)
        this.files = response.data
      })
    },
  },
  watch: {
    server() {
      this.fetchFiles()
    },
  }
}
</script>

<style lang="scss">
  .files-page {
    .p-card {
      position:relative
    }
    .add-file {
      position:absolute;
      right: 2rem;
      top: 1.5rem;
      z-index:10000
    }
  }
</style>