<template>
  <div class="players-page">
    <div class="p-card p-p-5">
      <DataTable :value="players" dataKey="vin" :loading="loading">
        <Column field="SteamID" header="Steam ID">
          <template #body="slotProps">
            <a target="_blank" :href="`https://steamcommunity.com/profiles/${slotProps.data.SteamID}`">{{ slotProps.data.SteamID }}</a>
          </template>
        </Column>
        <Column field="DisplayName" header="Name"></Column>
        <!--<Column field="Address" header="Address"></Column>-->
        <Column field="ConnectedSeconds" header="ConnectedSeconds"></Column>
        <Column field="VoiationLevel" header="VoiationLevel"></Column>
        <Column field="Health" header="Health"></Column>
        <Column field="Ping" header="Ping"></Column>
        <template #empty>
            No records found.
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('server', ['servers']),
    server() {
      return this.servers[this.$route.query.server]
    },
    players() {
      return this.server.players ? this.server.players : []
    },
  },
  components: {
    DataTable, Column,
  },
  data() {
    return {
      interval: null,
      loading: false,
    }
  },
  created() {

  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval)
  },
  mounted() {
    this.update()
    this.interval = setInterval(this.update, 1000)
  },
  methods: {
    ...mapActions('server', ['getServerRconPlayers']),
    update() {
      this.getServerRconPlayers(this.$route.query.server)
    },
  }
}
</script>

<style lang="scss">
  .players-page {
    a {
      text-decoration: underline
    }
  }
</style>