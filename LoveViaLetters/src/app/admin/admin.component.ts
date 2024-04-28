import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserFirebaseService } from '../shared/userFirebase.service';
import { UserProfileInterface } from '../interfaces/userProfile.interface';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  userEmail: string = "";
  userId: string = "";
  reason: string = "";
  banTime: number = 0;
  profiles: UserProfileInterface[] = [];
  currentProfileIndex: number = 0;
  profileData: UserProfileInterface | null = null;
  filteredProfiles: UserProfileInterface[] = [];

  constructor(private firebaseService: UserFirebaseService, private authService: AuthService) {
    console.log(this.filteredProfiles)
  }
  ngOnInit(): void {
    console.log("onInitCalled")
    
      
        this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
          this.profiles = users.filter(user => user.UserId);
          if (this.profiles.length > 0) {
            this.profileData = this.profiles[this.currentProfileIndex];
            this.filteredProfiles = this.profiles


          }
        });

      
  }

  banProfile(user: string) {
    this.firebaseService.banUserById(user);
    console.log("Banneded Email: ", this.userEmail);
    console.log("Reason: ", this.reason);
    console.log("BanTime: ", this.banTime);
  }

  unBanProfile(user: string) {
    this.firebaseService.unBanUserById(user);
  }

  deleteUser(user: string) {
    console.log(user)
    this.firebaseService.deleteUser(user)
  }
}
