import { rconHandler } from '../utilities/rcon'

export default ({ app: { $axios }, store, route }, inject) => {
  inject('rcon', (callback) => {
    rconHandler(store.state.server.servers[route.query.server], callback)
  })
}