var ConnectionStatus = {
  'CONNECTING': 0,
  'OPEN': 1,
  'CLOSING': 2,
  'CLOSED': 3
};
var rcon = {
  Socket: null,
  Address: null,
};

class Rcon {
  callbacks = {}

  constructor(address, pass) {
    console.log("Connecting to", address, pass)
    this.socket = new WebSocket("ws://" + address + "/" + pass);
    this.address = address;
    this.socket.onmessage = this._onMessage.bind(this)
    var parent = this
    this.socket.onopen = function() {
      parent.onOpen()
    };
    this.socket.onclose = this.OnClose;
    this.socket.onerror = this.OnError;
  }

  _onMessage(e) {
    var data = JSON.parse(e.data)
    var message = data.Message
    console.log("Got message", data)

    try {
      message = JSON.parse(message)
    } catch(e) {
      console.log("Failed to parse json", e, message)
    }

    if (data.Identifier == -1 && this.onGenericMessage) {
      this.onGenericMessage(message)
      return
    }

    if (data.Identifier === 0 && this.onLogMessage) {
      this.onLogMessage(message)
      return
    }
    if (this.callbacks[data.Identifier]) {
      this.callbacks[data.Identifier](message);
      delete this.callbacks[data.Identifier]
    }
  }

  createIdentifier() {
    return Math.floor(Math.random() * 10000);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }  
  }

  isConnected() {
    if (this.socket == null)
      return false;
  
    return this.socket.readyState === ConnectionStatus.OPEN;
  }

  command(msg, callback) {
    if (this.socket === null)
      return;
  
    if (!this.isConnected())
      return;
    
  
    var packet = {
      Identifier: this.createIdentifier(),
      Message: msg,
      Name: "WebRcon"
    };

    this.callbacks[packet.Identifier] = callback
    this.socket.send(JSON.stringify(packet));
  };
}

var connections = {}

function rconHandler(server, callback) {
  const { password, address, port } = server
  const _address = `${address}:${port}`

  if (typeof connections[_address] !== 'undefined') {
    callback(connections[_address])
    return
  }

  let connection = new Rcon(_address, password)

  connection.onOpen = function() {
    connections[_address]  = connection
    callback(connection)
  }
}


export { rcon, rconHandler }