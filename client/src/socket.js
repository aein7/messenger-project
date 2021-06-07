import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updatedMessagesReadStatus
} from "./store/conversations";

class SocketService {
  constructor() {
    this.socket = io({
      autoConnect: false,
      secure: true
    });
  }

  connectSocket(userId){
    this.socket.on('connect', () => {
  
      this.socket.on("add-online-user", (id) => {
        store.dispatch(addOnlineUser(id));
      });
      
      this.socket.on("remove-offline-user", (id) => {
        store.dispatch(removeOfflineUser(id));
      });
    
      this.socket.on("new-message", (data) => {
        store.dispatch(setNewMessage(data.message, data.sender, data.isRecipient));
      });

      this.socket.on("conversation-read", (updatedConversation) => {
        store.dispatch(updatedMessagesReadStatus(updatedConversation))
      })
    });
  
    this.socket.open();
    this.socket.emit("go-online", userId);
  
    return this.socket
  }

  conversationRead(updatedConversation){
    this.socket.emit("conversation-read", {
      updatedConversation
    })
  }

  sendNewMessage(data,body) {
    this.socket.emit("new-message", {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  }

  disconnectSocketOnLogout(id){
    this.socket.emit("logout", id);
    this.socket.disconnect(true);
  }
}

const socketInstance = new SocketService();

export default socketInstance