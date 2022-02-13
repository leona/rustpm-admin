<template>
  <div class="files-page">
    <div class="p-card p-p-5">
      <TabView>
        <TabPanel v-for="(group, key) in files" :key="key" :header="capitalise(key)">
          <DataTable :value="group" dataKey="path" :loading="loading">
            <Column field="path" header="Path"></Column>
            <Column field="lastUpdated" header="Last modified"></Column>
            <Column field="size" header="Size"></Column>
            <Column>
              <template #body="slotProps">
                <NuxtLink :to="`/${server.address}:${server.port}/files/edit?path=${slotProps.data.path}&group=${key}`">
                  <Button type="button" class="p-button-info p-mr-2" icon="pi pi-code"></Button>
                </NuxtLink>
                <Button type="button" class="p-button-danger" icon="pi pi-trash"></Button>
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
import { mapActions, mapState } from 'vuex'
import { capitalise } from '../../../utilities/string'

export default {
  computed: {
    ...mapState('server', ['servers']),
    server() {
      return this.servers[this.$route.params.server]
    },
  },
  components: {
    DataTable, Column, TabView, TabPanel
  },
  mounted() {
    this.fetchFiles()
  },
  data() {
    return {
      loading: false,
      files: {}
    }
  },
  methods: {
    capitalise(value) {
      return capitalise(value)
    },
    fetchFiles() {
      const { address, apiPort, password } = this.server
      this.$axios.get(`http://${address}:${apiPort}/files`, {
        headers: { "api-key": password }
      }).then((response) => {
        console.log("Got files:", response.data)
        this.files = response.data
      })
    }
  }
}
</script>

<style lang="scss">
  .players-page {

  }
</style>