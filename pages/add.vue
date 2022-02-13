<template>
  <div class="add-page">
    <div class="p-card p-p-5 inline">
      <h1 class="p-mt-0">Add server</h1>
      <form @submit.prevent="onSubmit()">
        <span class="p-float-label p-my-3">
          <InputText id="address" type="text" v-model="address" />
          <label for="address">IP Address</label>
        </span>
        <span class="p-float-label p-my-3">
          <InputText id="port" type="text" v-model="port" />
          <label for="port">RCON Port</label>
        </span>
        <span class="p-float-label p-my-3">
          <InputText id="password" type="text" v-model="password" />
          <label for="password">RCON Password</label>
        </span>
        <span class="p-float-label p-my-3">
          <InputText id="apiPort" type="text" v-model="apiPort" />
          <label for="apiPort">Rustpm API Port (optional)</label>
        </span>
        <Button label="Submit" type="submit" class="p-button-info" />
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  computed: {
  },
  data() {
    return {
      address: null,
      port: null,
      password: null,
      apiPort: null
    }
  },
  methods: {
    ...mapActions('server', ['addServer']),
    onSubmit() {
      let { address, port, password, apiPort } = this
      this.addServer({
        address, port, password, apiPort
      })
      this.$router.push({
        path: `/${address}:${port}/manage`
      })
    }
  }
}
</script>

<style lang="scss">
  .add-page {
    input {
      width:350px
    }
  }
</style>