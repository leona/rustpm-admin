export default ({ app: { $axios }, store }, inject) => {
  inject('rustpm', {
    get(endpoint, params) {
      return this.request($axios.get, endpoint, params)
    },
    delete(endpoint, params) {
      return this.request($axios.delete, endpoint, params)
    },
    put(endpoint, params, data) {
      return this.request($axios.put, endpoint, params, data)
    },
    request(method, endpoint, params, data) {
      const { address, apiPort, password } = store.state.server.server
      const url = `http://${address}:${apiPort}/${endpoint}`
      const headers = { "api-key": password }

      if (data) {
        return method(url, data, {
          params, 
          headers
        })
      } else {
        return method(url, {
          params, 
          headers
        })
     }
    }
  })
}