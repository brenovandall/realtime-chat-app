import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivatechatComponent } from '../privatechat/privatechat.component';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css'
})
export class MenubarComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  submitted = false;
  apiErrors: string[] = [];
  openChat = false;
  constructor(private formBuilder: FormBuilder, public service: ChatService, public modal: NgbModal) {}

  ngOnInit(): void {
    this.initializerForm();
  }

  initializerForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    })
  }

  submitForm() {
    this.submitted = true;
    this.apiErrors = [];
    
    if(this.userForm.valid) {
      this.service.registerUser(this.userForm.value).subscribe({
        next: () => {
          this.service.myName = this.userForm.get('name')?.value;
          this.openChat = true;
          this.userForm.reset();
          this.submitted = false;
        },
        error: error => {
          if(typeof(error.error) !== 'object') {
            this.apiErrors.push(error.error);
          }
        }
      })
    }
  }

  closeChat() {
    this.openChat = false;
  }

  openPrivateChat(toUser: string) {
    const modalRef = this.modal.open(PrivatechatComponent);
    modalRef.componentInstance.toUser = toUser;
  }
}
