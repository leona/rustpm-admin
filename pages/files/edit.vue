<template>
  <div class="file-page">
    <div class="p-card p-p-5">
      <div class="controls p-mb-3 p-d-flex p-ai-center">
        <InputText type="text" placeholder="Filename" v-model="path" />
        <Button class="p-button-success p-mx-2" @click="onSaveFile">Save</Button>
        <Button class="p-button-danger" @click="onDeleteFile">Delete</Button>
        <i v-if="loading" class="pi pi-spin pi-spinner p-ml-3" />
      </div>
      <editor v-model="file" :extension="extension"></editor>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('server', ['servers', 'server']),
  },
  mounted() {
    if (this.server.address) {
      this.fetchFile()
    }
  },
  data() {
    const { group, path } = this.$route.query
    return {
      file: "",
      extension: "",
      path: path,
      group: group,
      loading: true,
      tailMode: false,
      fileUpdated: null
    }
  },
  methods: {
    onUpdateEditor(file) {
      this.file = file
    },
    onSaveFile() {
      this.loading = true
      let { group, path, file } = this
      const { server } = this.$route.query

      if (this.$route.query.path) {
        path = this.$route.query.path
      }

      this.$rustpm.put('file', { group, path }, {
        name: this.path,
        content: this.fileUpdated ? this.fileUpdated : this.file
      }).then(() => {
        this.$toast.info(`Saved ${path}`, {
          position: "bottom-right",
          duration : 5000
        })
        this.loading = false
      }).catch(() => {
        this.$toast.error(`Failed to save ${path}`, {
          position: "bottom-right",
          duration : 5000
        })
        this.loading = false
      })
    },
    onDeleteFile() {
      const { group, path } = this
      const { server } = this.$route.query
      if (!confirm(`Are you sure you want to delete ${path}?`)) return

      this.$rustpm.delete('file', { group, path }).then(() => {
        this.$toast.error(`Deleted ${path}`, {
            position: "bottom-right",
            duration : 5000
        })
        
        this.$router.push({
          path: '/files',
          query: { server }
        })
      }).catch(() => {
        this.$toast.error(`Failed to delete ${path}`, {
            position: "bottom-right",
            duration : 5000
        })
      })
    },
    fetchFile() {
      const { group, path } = this

      if (!path) {
        this.loading = false
        return
      }
      this.loading = true
      this.extension = path.split('.').pop();
      
      this.$rustpm.get('file', { group, path }).then((response) => {
        this.file = response.data
        this.loading = false
        this.$forceUpdate()
      })
    }
  },
  watch: {
    server() {
      this.fetchFile()
    }
  }
}
</script>

<style lang="scss">
  .file-page {

  }
</style>