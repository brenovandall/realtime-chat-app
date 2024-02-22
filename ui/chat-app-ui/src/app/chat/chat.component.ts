import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  @Output() closeChatEmitter = new EventEmitter();
  constructor(public service: ChatService) {}

  ngOnDestroy(): void {
    this.service.stopConnection();
    console.log("server is out");
  }

  ngOnInit(): void {
    this.service.createConnection();
  }

  backToHome() {
    this.closeChatEmitter.emit();
  }

  sendMessage(content: string) {
    this.service.sendMessage(content);
  }
}
