<template>
  <div class="file-page">
    <div class="p-card p-p-5">
      <div class="controls p-mb-3 p-d-flex p-ai-center">
        <InputText type="text" placeholder="Filename" v-model="path" />
        <Button class="p-button-success p-mx-2">Save</Button>
        <Button class="p-button-danger">Delete</Button>
        <div class="field-checkbox p-mx-3">
            <Checkbox id="tailMode" v-model="tailMode" :binary="true" />
            <label for="tailMode">Tail mode</label>
        </div>
        <i v-if="loading" class="pi pi-spin pi-spinner p-ml-3" />
      </div>
      <editor :content="file" :extension="extension"></editor>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('server', ['servers']),
    server() {
      return this.servers[this.$route.params.server]
    },
  },
  mounted() {
    this.fetchFile()
  },
  data() {
    const { group, path } = this.$route.query
    return {
      file: "",
      extension: "",
      path: path,
      group: group,
      loading: true,
      tailMode: false
    }
  },
  methods: {
    fetchFile() {
      const { group, path } = this
      const { address, apiPort, password } = this.server
      this.loading = true
      this.extension = path.split('.').pop();
      
      this.$axios.get(`http://${address}:${apiPort}/file`, {
        params: {
          group, path
        },
        headers: { "api-key": password}
      }).then((response) => {
        this.file = response.data
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
  .file-page {

  }
</style>