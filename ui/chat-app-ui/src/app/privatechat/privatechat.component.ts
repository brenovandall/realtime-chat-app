import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-privatechat',
  templateUrl: './privatechat.component.html',
  styleUrl: './privatechat.component.css'
})
export class PrivatechatComponent implements OnDestroy {
  @Input() toUser = '';
  constructor(public activeModal: NgbActiveModal, public service: ChatService) {}

  ngOnDestroy(): void {
    this.service.closePrivateMessage(this.toUser);
  }

  sendMessage(content: string) {
    this.service.sendPrivateMessages(this.toUser, content);
  }
}
