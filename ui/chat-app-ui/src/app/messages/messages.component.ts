import { Component, Input } from '@angular/core';
import { Message } from '../services/models/interfaces';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  @Input() messages: Message[] = [];
  constructor() {}
}
