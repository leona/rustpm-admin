import { rconHandler } from '../utilities/rcon'

var connection;

const initState = {
  servers: JSON.parse(localStorage.getItem('servers')) || {},
};

const state = () => ({
  ...initState,
});

const actions = {
  deleteServer({ commit }, payload) {
    commit("deleteServer", payload);
  },

  addServer({ commit }, payload) {
    commit("addServer", payload);
  },

  getServerRconInfo({ commit, state }, address) {
    rconHandler(state.servers[address], (connection) => {
      connection.command("serverinfo", (info) => {
        commit("setServerInfo", { address, info })
      })
    })
  },

  getServerRconPlayers({ commit, state }, address) {
    rconHandler(state.servers[address], (connection) => {
      connection.command("playerlist", (players) => {
        commit("setServerPlayers", { address, players })
      })
    })
  }
};

const mutations = {
  deleteServer(state, payload) {
    console.log("Deleting server:", payload)
    let servers = JSON.parse(JSON.stringify(state.servers))
    delete servers[payload.address + ":" + payload.port]
    state.servers = servers
    localStorage.setItem("servers", JSON.stringify(state.servers))
  },
  addServer(state, payload) {
    console.log("Adding server:", payload)
    let servers = JSON.parse(JSON.stringify(state.servers))
    servers[payload.address + ":" + payload.port] = payload
    state.servers = servers
    localStorage.setItem("servers", JSON.stringify(state.servers))
  },
  setServerPlayers(state, payload) {
    //console.log("Setting server players:", payload)
    let servers = JSON.parse(JSON.stringify(state.servers))
    servers[payload.address].players = payload.players
    state.servers = servers
  },
  setServerInfo(state, payload) {
    //console.log("Setting server info:", payload)
    let servers = JSON.parse(JSON.stringify(state.servers))
    servers[payload.address].info = payload.info
    state.servers = servers
  },
};

export default {
  state,
  actions,
  mutations,
  namespaced: true,
};
