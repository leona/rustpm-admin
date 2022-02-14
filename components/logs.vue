<template>
  <div class="p-card p-px-5 p-py-3 p-mb-5 logs-component">
    <div class="p-d-flex p-ai-center p-mb-3">
      <h4>Logs</h4>
      <div class="field-checkbox p-ml-3 p-d-flex p-ai-center">
        <Checkbox id="city1" name="city" v-model="monitor" :binary="true" />
        <label for="city1" class="p-ml-2">Monitor</label>
      </div>
    </div>
    <Textarea ref="logOutput" disabled class="console-output" :value="logs"></Textarea>
  </div>
</template>

<script>
import Textarea from 'primevue/textarea';

export default {
  components: {
    Textarea
  },
  mounted() {
    this.monitor = true
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval)
  },
  data() {
    return {
      logs: null,
      monitor: false
    }
  },
  methods: {
    checkLogs() {
      this.$rustpm.get('logs').then((response) => {
        if (response.data.error != "") {
          return
        }
        this.logs = response.data.response
        setTimeout(() => {
          this.$refs.logOutput.$el.scrollTop = this.$refs.logOutput.$el.scrollHeight;
        }, 10)
      })
    },
  },
  watch: {
    monitor() {
      if (this.monitor) {
        this.interval = setInterval(this.checkLogs, 1000)
      } else {
        clearInterval(this.interval)
      }
    }
  }
}
</script>

<style lang="scss">
  .logs-component {
    .console-output {
      min-height:400px
    }
  }
</style>