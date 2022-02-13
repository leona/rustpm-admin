<template>
  <div class="manage-page">
    <div class="p-grid">
      <div class="p-col-7">
        <div class="p-card p-px-5 p-py-3">
          <h4>RCON Data</h4>
          <div class="p-grid rcon-data p-mt-2">
            <div class="p-col-4">
              <p>Hostname: <span>{{ info.Hostname }}</span></p>
              <p>Queued: <span>{{ info.Queued }}</span></p>
              <p>GameTime: <span>{{ info.GameTime }}</span></p>
              <p>Framerate: <span>{{ info.Framerate }}</span></p>
              <p>NetworkIn: <span>{{ info.NetworkIn }}</span></p>
              <p>SaveCreatedTime: <span>{{ info.SaveCreatedTime }}</span></p>
            </div>
            <div class="p-col-4">
              <p>MaxPlayers: <span>{{ info.MaxPlayers }}</span></p>
              <p>Joining: <span>{{ info.Joining }}</span></p>
              <p>Uptime: <span>{{ info.Uptime }}</span></p>
              <p>Memory: <span>{{ info.Memory }}</span></p>
              <p>NetworkOut: <span>{{ info.NetworkOut }}</span></p>
            </div>
            <div class="p-col-4">
              <p>Players: <span>{{ info.Players }}</span></p>
              <p>EntityCount: <span>{{ info.EntityCount }}</span></p>
              <p>Map: <span>{{ info.Map }}</span></p>
              <p>Collections: <span>{{ info.Collections }}</span></p>
              <p>Restarting: <span>{{ info.Restarting }}</span></p>
            </div>
          </div>
        </div>
        <div class="p-card p-px-5 p-py-3 p-mt-3">
          <h4 class="p-mb-3">Console</h4>
          <Textarea ref="consoleOutput" disabled class="console-output main-log" :value="logs"></Textarea>
          <div class="console-input p-mt-3">
            <span class="p-input-icon-right">
              <InputText v-on:keyup.enter="onSubmitCommand" placeholder="Command..." type="text" v-model="command" />
              <i class="pi pi-server" />
            </span>
          </div>
        </div>
      </div>
      <div class="p-col-5">
        <div class="p-card p-px-5 p-pt-3 p-pb-4 operations">
          <div class="p-grid">
            <div class="p-col-6">
              <h4>Operations</h4>
            </div>
            <div class="p-col-6">
              <p class="state">State <span>Running</span></p>
            </div>
          </div>
          <div class="p-d-flex p-jc-between">
            <Button class="p-button-warning">Restart</Button>
            <Button class="p-button-success">Start</Button>
            <Button class="p-button-danger">Stop</Button>
            <Button class="p-button-info">Update</Button>
            <Button class="p-button-danger">Wipe</Button>
          </div>
        </div>
        <div class="p-card p-px-5 p-pt-3 p-pb-4 p-mt-3 connection">
          <h4>Connection</h4>
          <form @submit.prevent="onSubmitConnection()">
            <div class="extras p-my-3 p-d-flex p-jc-between">
              <span class="p-float-label">
                <InputText type="password" v-model="password" />
                <label for="username">RCON Password</label>
              </span>
              <span class="p-float-label">
                <InputText type="text" v-model="apiPort" />
                <label for="username">API Port</label>
              </span>
            </div>
            <Button class="p-button-success p-mx-2" type="submit">Save</Button>
            <Button class="p-button-danger p-mx-2" @click="onDelete">Delete</Button>
          </form>
        </div>
        <div class="p-card p-px-5 p-pt-3 p-pb-4 p-mt-3 chat">
          <h4 class="p-mb-3">Chat</h4>
          <Textarea ref="chatOutput" disabled class="console-output" :value="chat"></Textarea>
          <div class="console-input p-mt-3">
            <span class="p-input-icon-right">
              <InputText v-on:keyup.enter="onSubmitChat" placeholder="Say..." type="text" v-model="chatCommand" />
              <i class="pi pi-send" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import { mapActions, mapState } from 'vuex'
import { rconHandler } from '../../utilities/rcon'

export default {
  components: {
    Textarea, Button
  },
  computed: {
    ...mapState('server', ['servers']),
    server() {
      return this.servers[this.$route.params.server]
    },
    info() {
      return this.server.info ? this.server.info : {}
    }
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval)
  },
  mounted() {
    this.update()
    this.interval = setInterval(this.update, 1000)

    const { password, apiPort } = this.server
    this.password = password
    this.apiPort = apiPort

    rconHandler(this.servers[this.$route.params.server], (connection) => {
      connection.onGenericMessage = (data) => {
        console.log("Got generic", data)
        this.chat += `${data.Time}\t${data.Username}\t${data.Message}\n`
        this.$refs.chatOutput.$el.scrollTop = this.$refs.chatOutput.$el.scrollHeight;
      }
      connection.onLogMessage = (data) => {
        console.log("Got log", data)
        if (data.Message) {
          this.logs += `${data.Time}\t${data.Username}\t${data.Message}\n`
          this.$refs.consoleOutput.$el.scrollTop = this.$refs.consoleOutput.$el.scrollHeight;
        }
      }
    })
  },
  data() {
    return {
      password: null,
      apiPort: null,
      chatCommand: null,
      command: null,
      chat: "",
      logs: "", 
      interval: null,
    }
  },
  methods: {
    ...mapActions('server', ['getServerRconInfo', 'addServer', 'deleteServer']),
    update() {
      this.getServerRconInfo(this.$route.params.server)
    },
    onDelete() {
      let { address, port } = this.server

      this.deleteServer({
        address, port
      })
      
      this.$router.push({
        path: "/"
      })
    },
    onSubmitConnection() {
      let { password, apiPort } = this
      let { address, port } = this.server
      this.addServer({
        address, port, password, apiPort
      })
    },
    onSubmitChat() {
      const { chatCommand } = this
      this.chatCommand = null
      rconHandler(this.servers[this.$route.params.server], (connection) => {
        connection.command("say " + chatCommand)
      })
    },
    onSubmitCommand() {
      const { command } = this
      this.command = null
      rconHandler(this.servers[this.$route.params.server], (connection) => {
        connection.command(command, (response) => {
          this.logs += `${response}\n`
          this.$refs.consoleOutput.$el.scrollTop = this.$refs.consoleOutput.$el.scrollHeight;
        })
      })
    }
  },
  watch: {
    servers() {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
  .manage-page {
    h4, p {
      margin:0
    }

    h4 {
      font-size:30px
    }

    .main-log {
      height:240px
    }
    .chat {
      .console-output {
        min-height:250px;
      }
    }

    .console-input {
      span, input {
        width:100%
      }
    }

    .operations {
      .state {
        text-align: right;
        font-size: 12px;

        span {
          color: green;
          font-size: 20px;
          display:block
        }
      }
    }
    .rcon-data {
      p {
        color:#979797;
        margin-bottom:10px;
      }
      span {
        color:white;
        display:block
      }
    }
  }
</style>