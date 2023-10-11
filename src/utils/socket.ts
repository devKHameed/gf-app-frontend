import { getUser } from "utils";

export default class AppSocket {
  static socket: WebSocket | null = null;
  static loggedIn: boolean = false;
  static connect(
    host: string,
    onOpen: (e: Event) => void,
    onMessage: (e: MessageEvent) => void,
    onClose: (e: CloseEvent) => void
  ) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.close();
    }

    this.socket = new WebSocket(host);
    let interval: NodeJS.Timeout;
    this.socket.onerror = (e) => {
      console.log("Socket error", e);
    };
    this.socket.onopen = (e) => {
      console.log("Socket opened", e);
      if (this.socket) {
        this.socket.onmessage = (e) => {
          onMessage(e);
        };
      }
      AppSocket.login();
      interval = setInterval(() => {
        if (this.socket) {
          this.socket.send(
            JSON.stringify({
              action: "agent-ping",
              metadata: {
                user_id: getUser()?.slug,
              },
            })
          );
        }
      }, 100000);

      onOpen(e);
    };
    this.socket.onclose = (e) => {
      console.log("Socket closed", e);
      this.socket = null;
      onClose(e);
      clearInterval(interval);
    };
  }
  static login(u: Partial<User> = {}) {
    const user = getUser() || u;
    // console.log(
    //   !this.loggedIn,
    //   user.slug,
    //   this.socket,
    //   this.socket?.readyState === WebSocket.OPEN
    // );
    if (
      !this.loggedIn &&
      user.slug &&
      this.socket &&
      this.socket?.readyState === WebSocket.OPEN
    ) {
      this.loggedIn = true;
      this.socket.send(
        JSON.stringify({
          action: "login",
          metadata: {
            user_id: getUser()?.slug,
          },
        })
      );
    }
  }

  static disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  static send(message: string) {
    if (this.socket) {
      this.socket.send(message);
    }
  }
}
