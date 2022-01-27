class PlaybackSocketConnectionHandler {
  constructor(socket, groupId, seekHandler) {
    this.socket = socket;
    this.groupId = groupId;
    this.socket.on("connect", () => this.handleConnection());
    this.socket.on("video-connect", (v) => this.handleVideoSync(v));
    this.socket.on("video-sync", (e) => seekHandler(e));
    this.socket.on("disconnect", () => this.disconnect());
    this.socket.on("connect_error", (e) => this.handleConnectionError(e));
  }

  handleVideoSync(v) {
    this.socket.emit("video-control", { ...v, groupId: this.groupId });
    return v;
  }
  disconnect() {}

  handleConnection() {
    console.log("Connection complete", this.socket.id);
    console.log("Joining Group", this.groupId);
    this.socket.emit("join-group", this.groupId);
  }

  handleConnectionError(e) {
    console.log("connection error", e);
  }

  connect(username) {
    this.socket.auth = { username };
    this.socket.connect();
  }
}

export default PlaybackSocketConnectionHandler;
