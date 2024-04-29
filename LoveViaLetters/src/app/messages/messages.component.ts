import {Component, NgIterable, OnInit} from '@angular/core';
import {UserFirebaseService} from "../shared/userFirebase.service";
import {AuthService} from "../shared/auth.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserProfileInterface} from "../interfaces/userProfile.interface";
import {ChatMessageInterface} from "../interfaces/chatMessage.interface";


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  matchedUsers: UserProfileInterface[] = [];
  selectedUser: UserProfileInterface | null = null;
  chatMessages: ChatMessageInterface[] = [];
  newMessage: string = '';


  constructor(private userFirebaseService: UserFirebaseService, protected authService: AuthService) {
  }

  ngOnInit() {
    this.userFirebaseService.getUsers().subscribe(users => {
      const currentUser = users.find(user => user.UserId === this.authService.getUid());
      if (currentUser) {
        this.matchedUsers = users.filter(user => currentUser.Matches.includes(user.UserId));
      }
    });
  }

  openChat(user: UserProfileInterface) {
    this.selectedUser = user;
    // Simulate loading chat messages from a service
    this.loadChatMessages();
  }

  loadChatMessages() {

    const uuid = this.authService.getUid()
    if (uuid) {
      this.userFirebaseService.getMatchMessages(uuid, this.selectedUser?.UserId).subscribe(messages =>
      {


        console.log(messages)

        messages.sort((a, b) =>
          a.createdAt.valueOf() - b.createdAt.valueOf());

        this.chatMessages = messages;

        console.log(this.chatMessages)
      })
    }
  }

  sendMessage() {
    const uuid = this.authService.getUid()
    if (uuid) {
      if (this.newMessage.trim() === '') return;

      this.userFirebaseService.sendMessage(uuid, this.selectedUser!.UserId, this.newMessage)
      this.newMessage = '';
    }
  }



}
