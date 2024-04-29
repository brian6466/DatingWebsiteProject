import { Component, NgModule, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { UserFirebaseService } from '../shared/userFirebase.service';
import { UserProfileInterface } from '../interfaces/userProfile.interface';
import { getAuth } from "firebase/auth";
import { UserInterface } from '../interfaces/user.interface';
import { BannedService } from '../shared/banned.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = "";
  password: string = "";
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  loginError: boolean = false;
  private errorMessage: any;
  profiles: UserProfileInterface[] = [];
  filteredProfiles: UserProfileInterface[] = [];
  profileData: UserProfileInterface | null = null;
  currentProfileIndex: number = 0;
  auth: any = getAuth()
  user: any = this.auth.currentUser;
  banned: boolean = false;
  admin: boolean = false;
  



  constructor(private router: Router, private authService: AuthService, private firebaseService: UserFirebaseService, private bannedService: BannedService) {
    this.authService.currentUserSignal = signal(null)
  
  }

  loadProfiles() {
      this.firebaseService.getUsers().subscribe((users: UserProfileInterface[]) => {
        this.profiles = users.filter(user => user.UserId);
        if (this.profiles.length > 0) {
          this.profileData = this.profiles[this.currentProfileIndex];
          this.filteredProfiles = this.profiles
        }
      });
    
  }

  

  showLogin() {
    this.loadProfiles();
    if (!this.emailRegex.test(this.email)) {
      console.log("Invalid email format");
      this.loginError = true;
      return;
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: () => {

          const currentUserId = this.authService.getUid()
          console.log("User ID, ", this.authService.getUid())
          //this.banned = this.bannedService.checkBan(currentUserId)

          for (let i = 0; i < this.filteredProfiles.length; i++) {

            if (currentUserId == this.filteredProfiles[i].UserId && this.filteredProfiles[i].isAdmin == true) {
              this.admin = true;
              this.bannedService.setAdmin(this.admin)
              this.bannedService.notifyButtonClick()

            }

            if (currentUserId == this.filteredProfiles[i].UserId && this.filteredProfiles[i].isBanned == true) {
              this.banned = true;
              this.bannedService.setBanned(this.banned);
              this.authService.logout()
              this.bannedService.notifyButtonClick()
              return;
            }
          }
          if (this.banned != true && currentUserId != null) {
    
            this.router.navigate(["/"]);
          }         
        },
        error: (err) => {
          //TODO: Make this error message appear on the login screen, also look into potential error messages that can happen
          this.errorMessage = err.code;
          console.log(this.errorMessage);
          this.loginError = true;
        }
      })
    }
  }


  logUserOut() {

  }
}
