<template>
  <div class="p-card p-px-5 p-pt-3 p-pb-4 operations-component">
    <div class="p-grid">
      <div class="p-col-5">
        <h4>Operations</h4>
      </div>
      <div class="p-col-7">
        <p class="state">State <span :style="{ color: stateTypeColour }">{{ capitalise(state.message) }}</span></p>
      </div>
    </div>
    <div class="p-d-flex p-jc-between">
      <Button class="p-button-warning" @click="onClickAction('restart')">Restart</Button>
      <Button class="p-button-success" @click="onClickAction('start')">Start</Button>
      <Button class="p-button-danger" @click="onClickAction('stop')">Stop</Button>
      <Button class="p-button-info" @click="onClickAction('update')">Update</Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { capitalise } from '../utilities/string'

export default {
  computed: {
    ...mapState('server', ['servers']),
    stateTypeColour() {
      switch(this.state.type) {
        case 'info':
          return '#4ab764'
        case 'warn':
          return '#b67b49'
        default:
          return '#d95454'
      }
    }
  },
  mounted() {
    this.checkState()
    this.interval = setInterval(this.checkState, 1000)
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval)
  },
  data() {
    return {
      state: {},
      error: null
    }
  },
  methods: {
    capitalise(string) { return capitalise(string) },
    onClickAction(action) {
      if (!confirm(`Are you sure you want to ${action} the server?`)) return
      this.$rustpm.get(`action/${action}`).then((response) => {
        console.log("Sent action", action)
        this.$toast.info(`Sent ${action} operation`, {
          position: "bottom-right",
          duration : 5000
        })
      }).catch(() => {
        this.$toast.error(`Failed to send ${action} operation`, {
          position: "bottom-right",
          duration : 5000
        })
      })
    },
    checkState() {
      this.$rustpm.get('state').then((response) => {
        if (response.data.error != "") {
          this.error = response.data.error
          this.state = {
            message: "API error",
            type: "danger"
          }
          return
        }
        this.state = response.data.response
      }).catch(() => {
        this.state = {
          message: "API unreachable",
          type: "danger"
        }
      })
    },
  },
  watch: {
    error() {
      console.log("Error", this.error)
    }
  }
}
</script>

<style lang="scss">
  .operations-component {
    .state {
      text-align: right;
      font-size: 12px;

      span {
        color: green;
        font-size: 17px;
        display:block
      }
    }
  }
</style>