import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Message, User } from './models/interfaces';
import { HttpClient } from '@angular/common/http';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from '../chat/chat.component';
import { PrivatechatComponent } from '../privatechat/privatechat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myName: string = '';
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  messages: Message[] = [];
  privateMessages: Message[] = [];
  privateMessageInitiated = false;
  constructor(private http: HttpClient, public modalService: NgbModal) { }

  registerUser(user: User) {
    return this.http.post(`${environment.apiURL}api/chat/register/user`, user);
  }

  createConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiURL}hubs/chat`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

      this.chatConnection.start().catch(error => {
        console.log(error);
      });

      this.chatConnection.on('UserConnected', () => {
        console.log('server is on');
        this.addUserConnectionId();
      })

      this.chatConnection.on('OnlineUsers', (onlineUsers) => {
        console.log('server is on');
        this.onlineUsers = [...onlineUsers]
      })

      this.chatConnection.on('NewMessage', (newMessage: Message) => {
        this.messages = [...this.messages, newMessage]
        console.log(this.messages);
      })

      this.chatConnection.on('OpenPrivateChat', (newMessage: Message) => {
        this.privateMessages = [...this.privateMessages, newMessage]
        this.privateMessageInitiated = true;
        const modalRef = this.modalService.open(PrivatechatComponent);
        modalRef.componentInstance.toUser = newMessage.from;
      })

      this.chatConnection.on('NewPrivateMessage', (newMessage: Message) => {
        this.privateMessages = [...this.privateMessages, newMessage]
      })

      this.chatConnection.on('ClosePrivateChat', () => {
        this.privateMessageInitiated = false;
        this.privateMessages = [];
        this.modalService.dismissAll();
      })
  }

  stopConnection() {
    this.chatConnection?.stop().catch(error => {
      console.log(error);
    })
  }

  addUserConnectionId() {
    return this.chatConnection?.invoke('AddUserConnectionId', this.myName)
      .catch(error => console.log(error)
      )
  }

  async sendMessage(content: string) {
    const message: Message = {
      from: this.myName,
      content: content
    }

    return this.chatConnection?.invoke('ReceiveMessage', message)
      .catch(error => console.log(error))
  }

  async sendPrivateMessages(to: string, content: string) {
    const privateMessage: Message = {
      from: this.myName,
      to,
      content
    }

    if(!this.privateMessageInitiated) {
      this.privateMessageInitiated = true;
      return this.chatConnection?.invoke('CreatePrivateChat', privateMessage).then(() => {
        this.privateMessages = [...this.privateMessages, privateMessage]
      })
      .catch(error => console.log(error)); 
    } else {
      return this.chatConnection?.invoke('ReceivePrivateMessage', privateMessage)
        .catch(error => console.log(error))
    }

    console.log(this.privateMessages);
    
  }

  async closePrivateMessage(otherUser: string) {
    return this.chatConnection?.invoke('RemovePrivateChat', this.myName, otherUser)
      .catch(error => console.log(error))
  }
}
