import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserFirebaseService } from '../shared/userFirebase.service';
import { UserProfileInterface } from '../interfaces/userProfile.interface';
import { initializeApp } from 'firebase-admin/app';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  userEmail: string = "";
  userId: string = "";
  reason: string = "";
  banTime: number = 0;
  profiles: UserProfileInterface[] = [];

  constructor(private firebaseService: UserFirebaseService) {
    //this.profiles.push(firebaseService.getUsers());
    
  }

  banProfile() {
    this.firebaseService.banUserById(this.userId);
    console.log("Banneded Email: ", this.userEmail);
    console.log("Reason: ", this.reason);
    console.log("BanTime: ", this.banTime);
  }
}
